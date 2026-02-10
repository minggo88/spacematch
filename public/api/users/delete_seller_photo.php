<?php
header('Content-Type: application/json; charset=utf-8');
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

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];

if (!$data || !isset($data->photo_id)) {
    echo json_encode(["success" => false, "message" => "photo_id가 필요합니다."]);
    exit;
}

$photo_id = intval($data->photo_id);

try {
    // Only allow deleting own photos
    $stmt = $conn->prepare("SELECT id, image_url FROM seller_photos WHERE id = ? AND user_id = ?");
    $stmt->execute([$photo_id, $user_id]);
    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$photo) {
        echo json_encode(["success" => false, "message" => "사진을 찾을 수 없습니다."]);
        exit;
    }

    // Delete from DB
    $del = $conn->prepare("DELETE FROM seller_photos WHERE id = ? AND user_id = ?");
    $del->execute([$photo_id, $user_id]);

    // Try to delete physical file
    $file_path = "../../" . ltrim($photo['image_url'], '/spacematch/');
    if (file_exists($file_path)) {
        @unlink($file_path);
    }

    echo json_encode(["success" => true, "message" => "사진이 삭제되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>