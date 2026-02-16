<?php
include_once '../db_connect.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    $base_cols = "id, name, role, status, password, email, phone, profile_image, venue_limit";

    // Dynamically include optional columns (same as me.php)
    $opt_cols = ['category', 'instagram', 'description', 'brand_name', 'real_name', 'is_public', 'country'];
    foreach ($opt_cols as $oc) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$oc}'");
        if ($chk->fetch())
            $base_cols .= ", {$oc}";
    }

    $query = "SELECT {$base_cols} FROM users WHERE email = ? LIMIT 0,1";
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
        if (password_verify($password, $row['password'])) {
            // Secure bcrypt hash match
            $password_valid = true;
        } else if ($password === $row['password'] && strlen($row['password']) < 60) {
            // Legacy plain-text password detected — auto-upgrade to bcrypt
            $password_valid = true;
            try {
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $conn->prepare("UPDATE users SET password = ? WHERE id = ?")->execute([$newHash, $row['id']]);
            } catch (PDOException $e) { /* non-critical */
            }
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

            // Track last activity on login
            try {
                $colCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'last_active_at'");
                if (!$colCheck->fetch()) {
                    $conn->exec("ALTER TABLE users ADD COLUMN last_active_at DATETIME NULL DEFAULT NULL");
                }
                $conn->prepare("UPDATE users SET last_active_at = NOW() WHERE id = ?")->execute([$row['id']]);
            } catch (PDOException $e) { /* non-critical */
            }

            // Prepare response data (exclude password)
            $user_data = $row;
            unset($user_data['password']);

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