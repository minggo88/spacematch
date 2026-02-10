<?php
include_once '../db_connect.php';
session_start();

// Check for admin or superadmin role
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id)) {
    $user_id = $data->user_id;

    // Get current status
    $query = "SELECT status, role FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(array("success" => false, "message" => "사용자를 찾을 수 없습니다."));
        exit;
    }

    // Don't allow blocking superadmins
    if ($row['role'] === 'superadmin') {
        echo json_encode(array("success" => false, "message" => "슈퍼 관리자는 차단할 수 없습니다."));
        exit;
    }

    // Regular admins cannot block other admins
    if ($_SESSION['user_role'] === 'admin' && $row['role'] === 'admin') {
        echo json_encode(array("success" => false, "message" => "관리자는 다른 관리자를 차단할 수 없습니다."));
        exit;
    }

    // Toggle status
    $new_status = ($row['status'] === 'blocked') ? 'active' : 'blocked';

    $update_query = "UPDATE users SET status = ? WHERE id = ?";
    $update_stmt = $conn->prepare($update_query);
    $update_stmt->bindParam(1, $new_status);
    $update_stmt->bindParam(2, $user_id);

    if ($update_stmt->execute()) {
        $message = ($new_status === 'blocked') ? '사용자가 차단되었습니다.' : '사용자 차단이 해제되었습니다.';
        echo json_encode(array("success" => true, "message" => $message, "new_status" => $new_status));
    } else {
        echo json_encode(array("success" => false, "message" => "상태 변경에 실패했습니다."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "user_id가 필요합니다."));
}
?>