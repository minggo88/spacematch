<?php
include_once '../db_connect.php';
session_start();

// Only admin and superadmin can create admins
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "권한이 없습니다."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password) && isset($data->name)) {

    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bindParam(1, $data->email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        echo json_encode(array("success" => false, "message" => "이미 존재하는 이메일입니다."));
        exit;
    }

    $query = "INSERT INTO users SET name=:name, email=:email, password=:password, role='admin', status='active'";

    $stmt = $conn->prepare($query);

    // Sanitize
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));

    // Password Hashing
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $password_hash);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "관리자가 생성되었습니다."));
    } else {
        echo json_encode(array("success" => false, "message" => "관리자 생성에 실패했습니다."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "모든 필드를 입력해주세요."));
}
?>