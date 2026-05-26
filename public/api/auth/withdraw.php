<?php
include_once '../db_connect.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(array("success" => false, "message" => "Not logged in."));
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Optional: allow payload to include id, but enforce it matches session.
$data = json_decode(file_get_contents("php://input"));
if (isset($data->id) && intval($data->id) !== $user_id) {
    echo json_encode(array("success" => false, "message" => "권한이 없습니다."));
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE users SET status = 'withdrawn', updated_at = NOW() WHERE id = ? AND status != 'withdrawn'");
    $stmt->execute([$user_id]);

    session_destroy();

    echo json_encode(array("success" => true, "message" => "회원 탈퇴가 완료되었습니다."));
} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "회원 탈퇴 처리 중 오류가 발생했습니다."));
}
?>

