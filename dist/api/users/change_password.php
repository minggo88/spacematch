<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Only admin/superadmin can change other users' passwords
// Normal users can change their own password
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = isset($data['email']) ? trim($data['email']) : '';
$new_password = isset($data['new_password']) ? $data['new_password'] : '';

if (empty($email) || empty($new_password)) {
    echo json_encode(["success" => false, "message" => "이메일과 새 비밀번호가 필요합니다."]);
    exit;
}

if (strlen($new_password) < 6) {
    echo json_encode(["success" => false, "message" => "비밀번호는 6자 이상이어야 합니다."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? '';
$user_email = $_SESSION['user_email'] ?? '';

// Check permission: admin/superadmin can change anyone, users can only change their own
$is_admin = in_array($user_role, ['admin', 'superadmin']);
if (!$is_admin && $user_email !== $email) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
    exit;
}

try {
    // Find the target user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $target = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$target) {
        echo json_encode(["success" => false, "message" => "사용자를 찾을 수 없습니다."]);
        exit;
    }

    // Update password
    $hashed = password_hash($new_password, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $update->execute([$hashed, $email]);

    echo json_encode(["success" => true, "message" => "비밀번호가 변경되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>