<?php
include_once '../db_connect.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// list 외의 action은 superadmin만 허용
$userRole = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
if (!isset($_SESSION['user_id']) || ($action !== 'list' && !in_array($userRole, ['superadmin']))) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => '권한이 없습니다.',
        'debug_role' => $userRole,
        'debug_session_keys' => array_keys($_SESSION)
    ]);
    exit;
}

// ── Auto-migrate: add category, plan_type, translations columns if missing ──
try {
    $cols = $conn->query("SHOW COLUMNS FROM payment_plans")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('category', $cols)) {
        $conn->exec("ALTER TABLE payment_plans ADD COLUMN category VARCHAR(100) DEFAULT '' AFTER target_role");
    }
    if (!in_array('plan_type', $cols)) {
        $conn->exec("ALTER TABLE payment_plans ADD COLUMN plan_type VARCHAR(20) DEFAULT 'single' AFTER category");
    }
    if (!in_array('translations', $cols)) {
        $conn->exec("ALTER TABLE payment_plans ADD COLUMN translations JSON DEFAULT NULL AFTER features");
    }
} catch (PDOException $e) {
    // silently ignore if table doesn't exist yet
}

try {
    switch ($action) {
        case 'list':
            $stmt = $conn->query("SELECT * FROM payment_plans ORDER BY sort_order ASC, id ASC");
            $plans = $stmt->fetchAll();
            foreach ($plans as &$p) {
                $p['features'] = json_decode($p['features'] ?? '[]', true) ?: [];
                $p['translations'] = json_decode($p['translations'] ?? '{}', true) ?: (object) [];
                // Ensure new fields are always present
                $p['category'] = $p['category'] ?? '';
                $p['plan_type'] = $p['plan_type'] ?? 'single';
            }
            echo json_encode(['success' => true, 'plans' => $plans]);
            break;

        case 'create':
            $translations = isset($input['translations']) ? json_encode($input['translations'], JSON_UNESCAPED_UNICODE) : '{}';
            $stmt = $conn->prepare("INSERT INTO payment_plans (name, description, amount, period, features, translations, target_role, category, plan_type, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['name'] ?? '',
                $input['description'] ?? '',
                intval($input['amount'] ?? 0),
                $input['period'] ?? 'monthly',
                json_encode($input['features'] ?? [], JSON_UNESCAPED_UNICODE),
                $translations,
                $input['target_role'] ?? 'all',
                $input['category'] ?? '',
                $input['plan_type'] ?? 'single',
                intval($input['is_active'] ?? 1),
                intval($input['sort_order'] ?? 0)
            ]);
            echo json_encode(['success' => true, 'message' => '서비스가 추가되었습니다.', 'id' => $conn->lastInsertId()]);
            break;

        case 'update':
            $id = intval($input['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID가 필요합니다.']);
                exit;
            }
            $translations = isset($input['translations']) ? json_encode($input['translations'], JSON_UNESCAPED_UNICODE) : '{}';
            $stmt = $conn->prepare("UPDATE payment_plans SET name=?, description=?, amount=?, period=?, features=?, translations=?, target_role=?, category=?, plan_type=?, is_active=?, sort_order=? WHERE id=?");
            $stmt->execute([
                $input['name'] ?? '',
                $input['description'] ?? '',
                intval($input['amount'] ?? 0),
                $input['period'] ?? 'monthly',
                json_encode($input['features'] ?? [], JSON_UNESCAPED_UNICODE),
                $translations,
                $input['target_role'] ?? 'all',
                $input['category'] ?? '',
                $input['plan_type'] ?? 'single',
                intval($input['is_active'] ?? 1),
                intval($input['sort_order'] ?? 0),
                $id
            ]);
            echo json_encode(['success' => true, 'message' => '서비스가 수정되었습니다.']);
            break;

        case 'delete':
            $id = intval($input['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID가 필요합니다.']);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM payment_plans WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => '서비스가 삭제되었습니다.']);
            break;

        case 'toggle':
            $id = intval($input['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID가 필요합니다.']);
                exit;
            }
            $stmt = $conn->prepare("UPDATE payment_plans SET is_active = NOT is_active WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => '상태가 변경되었습니다.']);
            break;

        case 'reorder':
            $orderedIds = $input['ordered_ids'] ?? [];
            if (empty($orderedIds) || !is_array($orderedIds)) {
                echo json_encode(['success' => false, 'message' => '순서 데이터가 필요합니다.']);
                exit;
            }
            $stmt = $conn->prepare("UPDATE payment_plans SET sort_order = ? WHERE id = ?");
            foreach ($orderedIds as $index => $id) {
                $stmt->execute([$index, intval($id)]);
            }
            echo json_encode(['success' => true, 'message' => '순서가 변경되었습니다.']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => '올바른 action이 필요합니다.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>