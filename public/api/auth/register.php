<?php
ob_start(); // Catch any stray output/warnings
include_once '../db_connect.php';
include_once '../notifications/send_email.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password) || !isset($data->name)) {
    ob_end_clean();
    echo json_encode(array("success" => false, "message" => "모든 필드를 입력해주세요."));
    exit;
}

try {
    // ── 1. Check if banned (table may not exist) ──
    try {
        $ban_stmt = $conn->prepare("SELECT id FROM banned_users WHERE email = ? OR phone = ? OR (business_no = ? AND business_no != '') LIMIT 1");
        $ban_stmt->execute([$data->email, $data->phone ?? '', $data->businessNumber ?? '']);
        if ($ban_stmt->rowCount() > 0) {
            ob_end_clean();
            echo json_encode(array("success" => false, "message" => "가입이 제한된 사용자입니다."));
            exit;
        }
    } catch (PDOException $e) {
        // banned_users table doesn't exist — skip
    }

    // ── 2. Check duplicate email ──
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_stmt->execute([$data->email]);
    if ($check_stmt->rowCount() > 0) {
        ob_end_clean();
        echo json_encode(array("success" => false, "message" => "이미 존재하는 이메일입니다."));
        exit;
    }

    // ── 3a. Fix status column: ENUM → VARCHAR to support 'pending' ──
    try {
        $col_info = $conn->query("SHOW COLUMNS FROM users LIKE 'status'")->fetch(PDO::FETCH_ASSOC);
        if ($col_info && stripos($col_info['Type'], 'enum') !== false) {
            $conn->exec("ALTER TABLE users MODIFY COLUMN status VARCHAR(20) DEFAULT 'active'");
        }
    } catch (PDOException $e) {
        // ignore
    }

    // ── 3b. Auto-migrate columns (safe for all MySQL versions) ──
    $columns_to_add = [
        'real_name' => "VARCHAR(100) DEFAULT NULL",
        'name_en' => "VARCHAR(100) DEFAULT NULL",
        'business_no' => "VARCHAR(50) DEFAULT NULL",
        'category' => "VARCHAR(100) DEFAULT NULL",
        'country' => "VARCHAR(5) DEFAULT NULL",
        'instagram' => "VARCHAR(255) DEFAULT NULL",
        'description' => "TEXT DEFAULT NULL",
        'marketing_agreed' => "TINYINT(1) DEFAULT 0",
        'venue_limit' => "INT DEFAULT 3",
        'keywords' => "TEXT DEFAULT NULL"
    ];

    foreach ($columns_to_add as $col_name => $col_def) {
        try {
            $col_check = $conn->query("SHOW COLUMNS FROM users LIKE '{$col_name}'");
            if ($col_check->rowCount() === 0) {
                $conn->exec("ALTER TABLE users ADD COLUMN {$col_name} {$col_def}");
            }
        } catch (PDOException $e) {
            // ignore — column may already exist
        }
    }

    // ── 4. Prepare data ──
    $name = htmlspecialchars(strip_tags($data->name));
    $real_name = isset($data->realName) ? htmlspecialchars(strip_tags($data->realName)) : null;
    $name_en = isset($data->nameEn) ? htmlspecialchars(strip_tags($data->nameEn)) : null;
    $business_no = isset($data->businessNumber) ? htmlspecialchars(strip_tags($data->businessNumber)) : null;
    $email = htmlspecialchars(strip_tags($data->email));
    $phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : null;
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $valid_roles = ['seller', 'host', 'vendor'];
    $role = (isset($data->role) && in_array($data->role, $valid_roles)) ? $data->role : 'seller';
    $initialStatus = ($role === 'host' || $role === 'vendor') ? 'pending' : 'active';

    $category = isset($data->category) ? htmlspecialchars(strip_tags($data->category)) : null;
    $country = isset($data->country) ? htmlspecialchars(strip_tags($data->country)) : null;
    $instagram = isset($data->instagram) ? htmlspecialchars(strip_tags($data->instagram)) : null;
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;
    $marketing = (isset($data->marketing_agreed) && $data->marketing_agreed) ? 1 : 0;
    $keywords = null;
    if (isset($data->keywords) && is_array($data->keywords) && count($data->keywords) > 0) {
        $sanitized = array_map(function ($kw) {
            return htmlspecialchars(strip_tags(trim($kw)));
        }, $data->keywords);
        $sanitized = array_filter($sanitized);
        $keywords = json_encode(array_values($sanitized), JSON_UNESCAPED_UNICODE);
    }

    // ── 5. INSERT ──
    $query = "INSERT INTO users (name, real_name, name_en, business_no, email, phone, password, role, category, country, instagram, description, status, marketing_agreed, venue_limit, keywords) 
              VALUES (:name, :real_name, :name_en, :business_no, :email, :phone, :password, :role, :category, :country, :instagram, :description, :status, :marketing_agreed, 3, :keywords)";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":real_name", $real_name);
    $stmt->bindParam(":name_en", $name_en);
    $stmt->bindParam(":business_no", $business_no);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":password", $password_hash);
    $stmt->bindParam(":role", $role);
    $stmt->bindParam(":category", $category);
    $stmt->bindParam(":country", $country);
    $stmt->bindParam(":instagram", $instagram);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":status", $initialStatus);
    $stmt->bindParam(":marketing_agreed", $marketing);
    $stmt->bindParam(":keywords", $keywords);

    if ($stmt->execute()) {
        // ── 6. Notify admins ──
        try {
            $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL, link VARCHAR(255), is_read BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX (user_id), INDEX (is_read)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            $roleLabel = ($role === 'host') ? '호스트' : '셀러';
            $approvalNote = ($role === 'host') ? ' (승인 대기 중)' : '';
            $notifMsg = "새 {$roleLabel} '{$name}'님이 가입했습니다.{$approvalNote}";
            $notifLink = "/admin/users";

            $admins = $conn->query("SELECT id FROM users WHERE role IN ('admin', 'superadmin')")->fetchAll(PDO::FETCH_ASSOC);
            $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'user_registered', ?, ?, NOW())");
            foreach ($admins as $admin) {
                $notifStmt->execute([$admin['id'], $notifMsg, $notifLink]);

                // [EMAIL] 신규 가입 이메일 알림 (다국어)
                try {
                    $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                    $_nm = $name;
                    sendEmailToUser(
                        $conn,
                        $admin['id'],
                        '',
                        '',
                        'cat_account',
                        function ($lang) use ($_nm, $siteUrl) {
                            $subj = _t(['ko' => "새 사용자가 가입했습니다: {$_nm}", 'en' => "New user registered: {$_nm}", 'ja' => "新規登録: {$_nm}", 'vi' => "Người dùng mới: {$_nm}", 'th' => "ผู้ใช้ใหม่: {$_nm}"], $lang);
                            return ['subject' => $subj, 'html' => emailTemplateAccountNotice('registered', $_nm, $siteUrl, $lang)];
                        }
                    );
                } catch (Exception $emailErr) {
                    error_log("Email error (user_registered): " . $emailErr->getMessage());
                }
            }
        } catch (Exception $e) {
            // notification failure should not block registration
        }

        $successMsg = ($role === 'host')
            ? "회원가입이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다."
            : "회원가입이 완료되었습니다.";

        ob_end_clean();
        echo json_encode(array("success" => true, "message" => $successMsg, "pending" => ($role === 'host')));
    } else {
        ob_end_clean();
        echo json_encode(array("success" => false, "message" => "회원가입에 실패했습니다."));
    }

} catch (PDOException $e) {
    ob_end_clean();
    error_log("SpaceMatch Register Error: " . $e->getMessage());
    echo json_encode(array("success" => false, "message" => "회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요."));
} catch (Exception $e) {
    ob_end_clean();
    error_log("SpaceMatch Register Error: " . $e->getMessage());
    echo json_encode(array("success" => false, "message" => "회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요."));
}
?>