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

// ── Auto-migration: ensure seller_stats table has all required columns ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        record_type VARCHAR(10) NOT NULL DEFAULT 'monthly',
        record_date VARCHAR(10) NOT NULL,
        monthly_revenue INT DEFAULT 0,
        customer_count INT DEFAULT 0,
        transaction_count INT DEFAULT 0,
        avg_unit_price INT DEFAULT 0,
        best_selling_item VARCHAR(200) DEFAULT NULL,
        venue_type VARCHAR(50) DEFAULT NULL,
        region VARCHAR(100) DEFAULT NULL,
        satisfaction TINYINT DEFAULT NULL,
        memo TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type_date (record_type, record_date),
        UNIQUE KEY uq_user_type_date (user_id, record_type, record_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add missing columns for existing tables
    $colsToAdd = [
        'venue_type' => "VARCHAR(50) DEFAULT NULL AFTER best_selling_item",
        'region' => "VARCHAR(100) DEFAULT NULL AFTER venue_type",
        'satisfaction' => "TINYINT DEFAULT NULL AFTER region",
        'memo' => "TEXT DEFAULT NULL AFTER satisfaction",
    ];
    foreach ($colsToAdd as $col => $def) {
        try {
            $conn->query("SELECT `$col` FROM seller_stats LIMIT 1");
        } catch (PDOException $ex) {
            $conn->exec("ALTER TABLE seller_stats ADD COLUMN `$col` $def");
        }
    }
} catch (PDOException $e) {
    // Table/columns already exist — ignore
}

try {
    switch ($action) {
        // ── LIST: 본인 데이터만 조회 ──
        case 'list':
            $type = $_GET['record_type'] ?? '';
            if ($type && in_array($type, ['daily', 'monthly', 'annual'])) {
                $stmt = $conn->prepare("SELECT * FROM seller_stats WHERE user_id = ? AND record_type = ? ORDER BY record_date DESC");
                $stmt->execute([$userId, $type]);
            } else {
                $stmt = $conn->prepare("SELECT * FROM seller_stats WHERE user_id = ? ORDER BY record_date DESC");
                $stmt->execute([$userId]);
            }
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Also return summary per record_type
            $summaryStmt = $conn->prepare("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price
                FROM seller_stats WHERE user_id = ? GROUP BY record_type
            ");
            $summaryStmt->execute([$userId]);
            $summaryRows = $summaryStmt->fetchAll(PDO::FETCH_ASSOC);
            $summary = [];
            foreach ($summaryRows as $sr) {
                $summary[$sr['record_type']] = $sr;
            }

            echo json_encode(["success" => true, "stats" => $rows, "summary" => $summary]);
            break;

        // ── SAVE: UPSERT (기간 기준 생성/수정) ──
        case 'save':
            $recordType = $input['record_type'] ?? 'monthly';
            $recordDate = trim($input['record_date'] ?? '');

            // Validate record_type
            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 기록 유형입니다."]);
                exit;
            }

            // Validate record_date format
            $valid = false;
            if ($recordType === 'daily' && preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $recordDate))
                $valid = true;
            if ($recordType === 'monthly' && preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $recordDate))
                $valid = true;
            if ($recordType === 'annual' && preg_match('/^\d{4}$/', $recordDate))
                $valid = true;

            if (!$valid) {
                echo json_encode(["success" => false, "message" => "올바른 날짜 형식이 아닙니다."]);
                exit;
            }

            $revenue = intval($input['monthly_revenue'] ?? 0);
            $customers = intval($input['customer_count'] ?? 0);
            $transactions = intval($input['transaction_count'] ?? 0);
            $unitPrice = intval($input['avg_unit_price'] ?? 0);
            $bestItem = trim($input['best_selling_item'] ?? '');
            $venueType = trim($input['venue_type'] ?? '');
            $region = trim($input['region'] ?? '');
            $satisfaction = intval($input['satisfaction'] ?? 0);
            $memo = trim($input['memo'] ?? '');

            if ($satisfaction < 0 || $satisfaction > 5)
                $satisfaction = 0;

            // Check if record exists
            $check = $conn->prepare("SELECT id FROM seller_stats WHERE user_id = ? AND record_type = ? AND record_date = ?");
            $check->execute([$userId, $recordType, $recordDate]);
            $existing = $check->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $stmt = $conn->prepare("UPDATE seller_stats SET 
                    monthly_revenue = ?, customer_count = ?, transaction_count = ?,
                    avg_unit_price = ?, best_selling_item = ?, venue_type = ?,
                    region = ?, satisfaction = ?, memo = ?
                    WHERE user_id = ? AND record_type = ? AND record_date = ?");
                $stmt->execute([
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $satisfaction ?: null,
                    $memo,
                    $userId,
                    $recordType,
                    $recordDate
                ]);
                echo json_encode(["success" => true, "message" => "데이터가 수정되었습니다.", "id" => $existing['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO seller_stats 
                    (user_id, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                     avg_unit_price, best_selling_item, venue_type, region, satisfaction, memo)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $userId,
                    $recordType,
                    $recordDate,
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $satisfaction ?: null,
                    $memo
                ]);
                echo json_encode(["success" => true, "message" => "데이터가 저장되었습니다.", "id" => $conn->lastInsertId()]);
            }
            break;

        // ── DELETE ──
        case 'delete':
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 ID입니다."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM seller_stats WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "데이터가 삭제되었습니다."]);
            } else {
                echo json_encode(["success" => false, "message" => "삭제할 데이터를 찾을 수 없습니다."]);
            }
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>