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

if (!isset($_SESSION['user_role']) || ($_SESSION['user_role'] !== 'admin' && $_SESSION['user_role'] !== 'superadmin')) {
    echo json_encode(array("success" => false, "message" => "권한이 없습니다."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->limit)) {
    echo json_encode(array("success" => false, "message" => "잘못된 요청입니다."));
    exit;
}

$user_id = $data->user_id;
$limit = intval($data->limit);

try {
    $stmt = $conn->prepare("UPDATE users SET venue_limit = ? WHERE id = ?");
    if ($stmt->execute([$limit, $user_id])) {
        echo json_encode(array("success" => true, "message" => "베뉴 등록 제한이 수정되었습니다."));
    } else {
        echo json_encode(array("success" => false, "message" => "업데이트 실패."));
    }
} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(array("success" => false, "message" => '서버 오류가 발생했습니다.'));
}
?>