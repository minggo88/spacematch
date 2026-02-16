<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

try {
    $stmt = $conn->query("SELECT * FROM payment_settings LIMIT 1");
    $settings = $stmt->fetch();

    if (!$settings) {
        // Return defaults if no row exists
        $settings = [
            'is_payment_enabled' => 0,
            'bank_name' => '',
            'account_number' => '',
            'account_holder' => '',
            'payment_notice' => '',
            'platform_fee_amount' => 0,
            'platform_fee_period' => 'monthly'
        ];
    }

    echo json_encode(['success' => true, 'settings' => $settings]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '설정 조회에 실패했습니다.']);
}
?>