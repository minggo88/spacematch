<?php
/**
 * Reset Password API
 * 
 * Step 1 - Verify identity:
 *   POST { "action": "verify", "email": "...", "name": "...", "phone": "..." }
 *   Response: { "success": true, "verified": true }
 * 
 * Step 2 - Reset password:
 *   POST { "action": "reset", "email": "...", "name": "...", "phone": "...", "newPassword": "..." }
 *   Response: { "success": true, "message": "비밀번호가 변경되었습니다." }
 */
include_once '../db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->action)) {
    echo json_encode(["success" => false, "message" => "잘못된 요청입니다."]);
    exit;
}

$action = $data->action;

// ── Step 1: Verify Identity ──
if ($action === 'verify') {
    if (!isset($data->email) || !isset($data->name) || !isset($data->phone)) {
        echo json_encode(["success" => false, "message" => "이메일, 이름, 연락처를 모두 입력해주세요."]);
        exit;
    }

    $email = htmlspecialchars(strip_tags($data->email));
    $name = htmlspecialchars(strip_tags($data->name));
    $phone = htmlspecialchars(strip_tags($data->phone));

    try {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND (real_name = ? OR name = ?) AND phone = ? LIMIT 1");
        $stmt->execute([$email, $name, $name, $phone]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "verified" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "입력하신 정보와 일치하는 계정을 찾을 수 없습니다."]);
        }
    } catch (PDOException $e) {
        error_log("ResetPassword Verify Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
    }
}

// ── Step 2: Reset Password ──
else if ($action === 'reset') {
    if (!isset($data->email) || !isset($data->name) || !isset($data->phone) || !isset($data->newPassword)) {
        echo json_encode(["success" => false, "message" => "모든 필드를 입력해주세요."]);
        exit;
    }

    $email = htmlspecialchars(strip_tags($data->email));
    $name = htmlspecialchars(strip_tags($data->name));
    $phone = htmlspecialchars(strip_tags($data->phone));
    $newPassword = $data->newPassword;

    // Validate password length
    if (strlen($newPassword) < 8) {
        echo json_encode(["success" => false, "message" => "비밀번호는 8자 이상이어야 합니다."]);
        exit;
    }

    try {
        // Re-verify identity before changing password
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND (real_name = ? OR name = ?) AND phone = ? LIMIT 1");
        $stmt->execute([$email, $name, $name, $phone]);

        if ($stmt->rowCount() === 0) {
            echo json_encode(["success" => false, "message" => "본인 확인에 실패했습니다."]);
            exit;
        }

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $password_hash = password_hash($newPassword, PASSWORD_BCRYPT);

        $update = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $update->execute([$password_hash, $user['id']]);

        echo json_encode(["success" => true, "message" => "비밀번호가 성공적으로 변경되었습니다."]);
    } catch (PDOException $e) {
        error_log("ResetPassword Error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "서버 오류가 발생했습니다."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "잘못된 요청입니다."]);
}
?>