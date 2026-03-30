<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : $_SESSION['user_id'];

// Create table if not exists (once per session)
if (empty($_SESSION['_ddl_seller_photos'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS seller_photos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            caption VARCHAR(200) DEFAULT '',
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id)
        )");
        $_SESSION['_ddl_seller_photos'] = true;
    } catch (PDOException $e) {
        // Continue
    }
}

try {
    $stmt = $conn->prepare("SELECT id, image_url, caption, sort_order, created_at FROM seller_photos WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC");
    $stmt->execute([$seller_id]);
    $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($photos as &$photo) {
        $photo['id'] = intval($photo['id']);
        $photo['sort_order'] = intval($photo['sort_order']);
    }

    echo json_encode(["success" => true, "photos" => $photos]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "오류가 발생했습니다."]);
}
?>