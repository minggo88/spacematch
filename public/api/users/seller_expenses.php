<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + seller role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if ($role !== 'seller') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "셀러만 이용 가능합니다."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? 'list';

// ── Auto-migration: create seller_expenses table ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        expense_date DATE NOT NULL,
        amount INT NOT NULL DEFAULT 0,
        category VARCHAR(50) NOT NULL DEFAULT 'other',
        payment_method VARCHAR(20) DEFAULT 'card',
        memo TEXT DEFAULT NULL,
        receipt_url VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_date (expense_date),
        INDEX idx_user_date (user_id, expense_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add columns if missing (for existing tables)
    $colsToAdd = [
        'receipt_url' => "VARCHAR(500) DEFAULT NULL AFTER memo",
    ];
    foreach ($colsToAdd as $col => $def) {
        try {
            $conn->query("SELECT `$col` FROM seller_expenses LIMIT 1");
        } catch (PDOException $ex) {
            $conn->exec("ALTER TABLE seller_expenses ADD COLUMN `$col` $def");
        }
    }
} catch (PDOException $e) {
    // Table already exists — ignore
}

try {
    switch ($action) {
        // ── LIST: 본인 지출 데이터 조회 ──
        case 'list':
            $year = $_GET['year'] ?? date('Y');
            $month = $_GET['month'] ?? '';

            if ($month) {
                $stmt = $conn->prepare("SELECT * FROM seller_expenses WHERE user_id = ? AND YEAR(expense_date) = ? AND MONTH(expense_date) = ? ORDER BY expense_date DESC");
                $stmt->execute([$userId, $year, $month]);
            } else {
                $stmt = $conn->prepare("SELECT * FROM seller_expenses WHERE user_id = ? AND YEAR(expense_date) = ? ORDER BY expense_date DESC");
                $stmt->execute([$userId, $year]);
            }
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Summary by category
            $catStmt = $conn->prepare("
                SELECT category,
                       COUNT(*) as count,
                       COALESCE(SUM(amount), 0) as total
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
                GROUP BY category
                ORDER BY total DESC
            ");
            $catStmt->execute([$userId, $year]);
            $categoryBreakdown = $catStmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly totals
            $monthlyStmt = $conn->prepare("
                SELECT DATE_FORMAT(expense_date, '%Y-%m') as month,
                       COALESCE(SUM(amount), 0) as total
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
                GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
                ORDER BY month ASC
            ");
            $monthlyStmt->execute([$userId, $year]);
            $monthlyTotals = $monthlyStmt->fetchAll(PDO::FETCH_ASSOC);

            // Total expense for the year
            $totalStmt = $conn->prepare("
                SELECT COALESCE(SUM(amount), 0) as total_expense,
                       COUNT(*) as total_count
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
            ");
            $totalStmt->execute([$userId, $year]);
            $totals = $totalStmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "expenses" => $rows,
                "categoryBreakdown" => $categoryBreakdown,
                "monthlyTotals" => $monthlyTotals,
                "totals" => $totals
            ]);
            break;

        // ── SAVE: 지출 기록 생성/수정 ──
        case 'save':
            $id = intval($input['id'] ?? 0);
            $expenseDate = trim($input['expense_date'] ?? '');
            $amount = intval($input['amount'] ?? 0);
            $category = trim($input['category'] ?? 'other');
            $paymentMethod = trim($input['payment_method'] ?? 'card');
            $memo = trim($input['memo'] ?? '');
            $receiptUrl = trim($input['receipt_url'] ?? '');

            // Validate
            if (!$expenseDate || !preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $expenseDate)) {
                echo json_encode(["success" => false, "message" => "올바른 날짜를 입력해주세요."]);
                exit;
            }
            if ($amount <= 0) {
                echo json_encode(["success" => false, "message" => "금액을 입력해주세요."]);
                exit;
            }

            $validCategories = [
                'materials',
                'packaging',
                'shipping',
                'booth_rental',
                'transport',
                'advertising',
                'commission',
                'labor',
                'equipment',
                'food',
                'communication',
                'other'
            ];
            if (!in_array($category, $validCategories)) {
                $category = 'other';
            }

            $validPayments = ['cash', 'card', 'transfer', 'other'];
            if (!in_array($paymentMethod, $validPayments)) {
                $paymentMethod = 'card';
            }

            if ($id > 0) {
                // Update existing
                $stmt = $conn->prepare("UPDATE seller_expenses SET
                    expense_date = ?, amount = ?, category = ?,
                    payment_method = ?, memo = ?, receipt_url = ?
                    WHERE id = ? AND user_id = ?");
                $stmt->execute([
                    $expenseDate,
                    $amount,
                    $category,
                    $paymentMethod,
                    $memo,
                    $receiptUrl,
                    $id,
                    $userId
                ]);
                if ($stmt->rowCount() > 0) {
                    echo json_encode(["success" => true, "message" => "지출 기록이 수정되었습니다.", "id" => $id]);
                } else {
                    echo json_encode(["success" => false, "message" => "수정할 데이터를 찾을 수 없습니다."]);
                }
            } else {
                // Insert new
                $stmt = $conn->prepare("INSERT INTO seller_expenses
                    (user_id, expense_date, amount, category, payment_method, memo, receipt_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $userId,
                    $expenseDate,
                    $amount,
                    $category,
                    $paymentMethod,
                    $memo,
                    $receiptUrl
                ]);
                echo json_encode(["success" => true, "message" => "지출 기록이 저장되었습니다.", "id" => $conn->lastInsertId()]);
            }
            break;

        // ── DELETE ──
        case 'delete':
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 ID입니다."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM seller_expenses WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "지출 기록이 삭제되었습니다."]);
            } else {
                echo json_encode(["success" => false, "message" => "삭제할 데이터를 찾을 수 없습니다."]);
            }
            break;

        // ── BULK DELETE ──
        case 'bulk_delete':
            $ids = $input['ids'] ?? [];
            if (!is_array($ids) || count($ids) === 0) {
                echo json_encode(["success" => false, "message" => "삭제할 ID가 없습니다."]);
                exit;
            }
            // Sanitize IDs
            $safeIds = array_map('intval', $ids);
            $safeIds = array_filter($safeIds, function ($v) {
                return $v > 0; });
            if (count($safeIds) === 0) {
                echo json_encode(["success" => false, "message" => "유효한 ID가 없습니다."]);
                exit;
            }
            $placeholders = implode(',', array_fill(0, count($safeIds), '?'));
            $params = array_merge($safeIds, [$userId]);
            $stmt = $conn->prepare("DELETE FROM seller_expenses WHERE id IN ($placeholders) AND user_id = ?");
            $stmt->execute($params);
            $deleted = $stmt->rowCount();
            echo json_encode(["success" => true, "message" => "{$deleted}건 삭제 완료", "deleted" => $deleted]);
            break;

        // ── SUMMARY: 연간 지출 요약 (대시보드 연동) ──
        case 'summary':
            $year = $_GET['year'] ?? $input['year'] ?? date('Y');

            // Total expense
            $totalStmt = $conn->prepare("
                SELECT COALESCE(SUM(amount), 0) as total_expense,
                       COUNT(*) as total_count
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
            ");
            $totalStmt->execute([$userId, $year]);
            $totals = $totalStmt->fetch(PDO::FETCH_ASSOC);

            // Category breakdown
            $catStmt = $conn->prepare("
                SELECT category,
                       COALESCE(SUM(amount), 0) as total,
                       COUNT(*) as count
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
                GROUP BY category
                ORDER BY total DESC
            ");
            $catStmt->execute([$userId, $year]);
            $categories = $catStmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly trend
            $monthlyStmt = $conn->prepare("
                SELECT DATE_FORMAT(expense_date, '%Y-%m') as month,
                       COALESCE(SUM(amount), 0) as total
                FROM seller_expenses
                WHERE user_id = ? AND YEAR(expense_date) = ?
                GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
                ORDER BY month ASC
            ");
            $monthlyStmt->execute([$userId, $year]);
            $monthly = $monthlyStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "totals" => $totals,
                "categories" => $categories,
                "monthly" => $monthly
            ]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>