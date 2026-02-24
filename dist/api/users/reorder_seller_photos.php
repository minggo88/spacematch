<?php
include_once '../db_connect.php';
session_start();

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

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['order']) || !is_array($data['order'])) {
    echo json_encode(["success" => false, "message" => "순서 데이터가 필요합니다."]);
    exit;
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("UPDATE seller_photos SET sort_order = ? WHERE id = ? AND user_id = ?");

    foreach ($data['order'] as $index => $photoId) {
        $stmt->execute([intval($index), intval($photoId), $user_id]);
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "순서가 변경되었습니다."]);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>