<?php
include_once '../db_connect.php';
session_start();

$userRole = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
if (!isset($_SESSION['user_id']) || $userRole !== 'superadmin') {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => '권한이 없습니다.',
        'debug_role' => $userRole,
        'debug_session_keys' => array_keys($_SESSION)
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$fields = ['is_payment_enabled', 'bank_name', 'account_number', 'account_holder', 'payment_notice', 'platform_fee_amount', 'platform_fee_period'];

try {
    // Check if settings row exists
    $check = $conn->query("SELECT COUNT(*) FROM payment_settings");
    if ($check->fetchColumn() == 0) {
        $conn->exec("INSERT INTO payment_settings (is_payment_enabled) VALUES (0)");
    }

    $setParts = [];
    $params = [];
    foreach ($fields as $field) {
        if (array_key_exists($field, $input)) {
            $setParts[] = "$field = ?";
            $params[] = $input[$field];
        }
    }

    if (empty($setParts)) {
        echo json_encode(['success' => false, 'message' => '수정할 항목이 없습니다.']);
        exit;
    }

    $sql = "UPDATE payment_settings SET " . implode(', ', $setParts) . " WHERE id = (SELECT id FROM (SELECT id FROM payment_settings LIMIT 1) AS tmp)";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => '결제 설정이 저장되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '설정 저장에 실패했습니다.']);
}
?>