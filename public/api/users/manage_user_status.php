<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../db_connect.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("success" => false, "message" => "로그인이 필요합니다."));
    exit;
}

// Check if user is admin or superadmin
if (!isset($_SESSION['user_role']) || ($_SESSION['user_role'] !== 'admin' && $_SESSION['user_role'] !== 'superadmin')) {
    echo json_encode(array("success" => false, "message" => "권한이 없습니다."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->action)) {
    echo json_encode(array("success" => false, "message" => "잘못된 요청입니다."));
    exit;
}

$user_id = $data->user_id;
$action = $data->action; // 'block', 'unblock', 'ban' (permanent delete & blacklist)

try {
    // Get user info first
    $stmt = $conn->prepare("SELECT role, email, phone, business_no FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(array("success" => false, "message" => "사용자를 찾을 수 없습니다."));
        exit;
    }

    // Role protection logic
    if ($user['role'] === 'superadmin') {
        echo json_encode(array("success" => false, "message" => "슈퍼 관리자는 변경할 수 없습니다."));
        exit;
    }

    // Removed restriction: Admins CAN now manage other admins (except superadmin, which is caught above)
    /*
    if ($_SESSION['user_role'] !== 'superadmin' && $user['role'] === 'admin') {
        echo json_encode(array("success" => false, "message" => "일반 관리자는 다른 관리자를 변경할 수 없습니다."));
        exit;
    }
    */

    if ($action === 'approve') {
        // Approve pending vendor
        if ($user['role'] !== 'vendor') {
            echo json_encode(array("success" => false, "message" => "벤더만 승인할 수 있습니다."));
            exit;
        }
        $updateStmt = $conn->prepare("UPDATE users SET status = 'active' WHERE id = ? AND status = 'pending'");
        $updateStmt->execute([$user_id]);
        if ($updateStmt->rowCount() > 0) {
            // Notify the vendor
            try {
                $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'vendor_approved', '가입 승인이 완료되었습니다. 이제 로그인할 수 있습니다!', '/login', NOW())");
                $notifStmt->execute([$user_id]);
            } catch (Exception $e) {
                error_log("Notification error (approve): " . $e->getMessage());
            }
            echo json_encode(array("success" => true, "message" => "벤더가 승인되었습니다."));
        } else {
            echo json_encode(array("success" => false, "message" => "이미 승인되었거나 대기 상태가 아닙니다."));
        }
    } elseif ($action === 'block') {
        $updateStmt = $conn->prepare("UPDATE users SET status = 'blocked' WHERE id = ?");
        $updateStmt->execute([$user_id]);
        echo json_encode(array("success" => true, "message" => "사용자가 차단되었습니다."));
    } elseif ($action === 'unblock') {
        $updateStmt = $conn->prepare("UPDATE users SET status = 'active' WHERE id = ?");
        $updateStmt->execute([$user_id]);
        echo json_encode(array("success" => true, "message" => "사용자 차단이 해제되었습니다."));
    } elseif ($action === 'ban') {
        // 1. Add to banned_users table
        $banStmt = $conn->prepare("INSERT INTO banned_users (email, phone, business_no, reason) VALUES (?, ?, ?, 'Admin Ban')");
        $banStmt->execute([$user['email'], $user['phone'], $user['business_no']]);

        // 2. Delete user
        // Note: In a real app, you might want soft delete. Here user asked to "delete user" but prevent signup.
        // We will hard delete to keep it clean, as we blacklist the credentials.
        $deleteStmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $deleteStmt->execute([$user_id]);

        echo json_encode(array("success" => true, "message" => "사용자가 영구 삭제 및 차단되었습니다."));
    } else {
        echo json_encode(array("success" => false, "message" => "알 수 없는 작업입니다."));
    }

} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
}
?>