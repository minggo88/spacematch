<?php
// Delete seller photo → Move to trash
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
    // Auto-create trash_bin table
    $conn->exec("CREATE TABLE IF NOT EXISTS trash_bin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        item_label VARCHAR(255) DEFAULT '',
        record_data JSON NULL,
        deleted_by INT NULL,
        deleted_by_name VARCHAR(100) DEFAULT '',
        deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_table (table_name),
        INDEX idx_deleted_at (deleted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Only allow deleting own photos
    $stmt = $conn->prepare("SELECT * FROM seller_photos WHERE id = ? AND user_id = ?");
    $stmt->execute([$photo_id, $user_id]);
    $photo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$photo) {
        echo json_encode(["success" => false, "message" => "사진을 찾을 수 없습니다."]);
        exit;
    }

    // Move to trash (keep physical file for restoration)
    $insertTrash = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (:tn, :ri, :il, :rd, :db, :dn)");
    $insertTrash->execute([
        ':tn' => 'seller_photos',
        ':ri' => $photo_id,
        ':il' => '셀러 사진 #' . $photo_id,
        ':rd' => json_encode($photo, JSON_UNESCAPED_UNICODE),
        ':db' => $user_id,
        ':dn' => $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'Unknown',
    ]);

    // Delete from DB (file preserved on disk)
    $del = $conn->prepare("DELETE FROM seller_photos WHERE id = ? AND user_id = ?");
    $del->execute([$photo_id, $user_id]);

    echo json_encode(["success" => true, "message" => "사진이 휴지통으로 이동되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>