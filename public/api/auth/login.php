<?php
include_once '../db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    $query = "SELECT id, name, role, status, password FROM users WHERE email = ? LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $email);
    $stmt->execute();
    $num = $stmt->rowCount();

    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // In a real app, use password_verify($password, $row['password'])
        // For now, since the schema has plain text 'admin' for admin, we support both or just plain text if that's what the user wants.
        // BUT for security, we should use hashing. For the migration, let's assume simple comparison for the existing 'admin' user, 
        // but new users should use password_hash.
        // Let's implement logic to support both for transition.

        $password_valid = false;
        if ($password === $row['password']) {
            $password_valid = true;
        } else if (password_verify($password, $row['password'])) {
            $password_valid = true;
        }

        if ($password_valid) {
            if ($row['status'] === 'pending') {
                echo json_encode(array("success" => false, "message" => "관리자 승인 대기 중입니다. 승인이 완료되면 로그인할 수 있습니다.", "pending" => true));
                exit;
            }
            if ($row['status'] === 'blocked') {
                echo json_encode(array("success" => false, "message" => "차단된 계정입니다. 관리자에게 문의하세요."));
                exit;
            }

            session_start();
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_email'] = $email;
            $_SESSION['user_role'] = $row['role'];
            $_SESSION['user_name'] = $row['name'];

            // Prepare response data (exclude password)
            $user_data = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $email,
                "role" => $row['role'],
                "status" => $row['status']
            );

            echo json_encode(array(
                "success" => true,
                "message" => "Successful login.",
                "user" => $user_data
            ));
        } else {
            echo json_encode(array("success" => false, "message" => "비밀번호가 일치하지 않습니다."));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "존재하지 않는 이메일입니다."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "이메일과 비밀번호를 입력해주세요."));
}
?>