<?php
// 결제 시스템 세션/DB 진단 테스트
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

$result = [
    'session_id' => session_id(),
    'session_status' => session_status(),
    'user_id' => $_SESSION['user_id'] ?? null,
    'name' => $_SESSION['name'] ?? null,
    'user_role' => $_SESSION['user_role'] ?? null,
    'role' => $_SESSION['role'] ?? null,
    'all_session_keys' => array_keys($_SESSION),
    'tables' => [],
    'server_time' => date('Y-m-d H:i:s'),
];

// Check tables
try {
    $tables = ['payment_settings', 'payments', 'payment_history', 'payment_plans'];
    foreach ($tables as $t) {
        try {
            $count = $conn->query("SELECT COUNT(*) FROM $t")->fetchColumn();
            $result['tables'][$t] = ['exists' => true, 'count' => (int) $count];
        } catch (PDOException $e) {
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            $result['tables'][$t] = ['exists' => false, 'error' => '서버 오류가 발생했습니다.'];
        }
    }
} catch (Exception $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    $result['db_error'] = $e->getMessage();
}

// Test file versions - check if key files have the fixes
$result['file_checks'] = [];
$manage_plans_content = file_get_contents(__DIR__ . '/manage_plans.php');
$result['file_checks']['manage_plans_has_user_role'] = strpos($manage_plans_content, "user_role") !== false;
$result['file_checks']['manage_plans_has_double_input'] = substr_count($manage_plans_content, "file_get_contents('php://input')") > 1;

$update_settings_content = file_get_contents(__DIR__ . '/update_settings.php');
$result['file_checks']['update_settings_has_user_role'] = strpos($update_settings_content, "user_role") !== false;

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>