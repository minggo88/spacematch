<?php
/**
 * toggle_email_verified.php — Admin toggles email_verified for a user
 * POST: { "user_id": int, "email_verified": 0|1 }
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=UTF-8');

// Admin/Superadmin only
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
$userId = intval($data->user_id ?? 0);
$verified = isset($data->email_verified) ? intval($data->email_verified) : 0;

if ($userId <= 0) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 사용자 ID입니다.']);
    exit;
}

try {
    // Ensure email_verified column exists
    $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
    if ($col_check->rowCount() === 0) {
        $conn->exec("ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0");
    }

    $stmt = $conn->prepare("UPDATE users SET email_verified = ? WHERE id = ?");
    $stmt->execute([$verified, $userId]);

    // Fetch updated value
    $fetchStmt = $conn->prepare("SELECT email_verified FROM users WHERE id = ?");
    $fetchStmt->execute([$userId]);
    $updated = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => $verified ? '이메일 인증 처리 완료' : '이메일 인증 해제 완료',
        'email_verified' => intval($updated['email_verified'])
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        'message' => '서버 오류가 발생했습니다.'
    ], JSON_UNESCAPED_UNICODE);
}
?>