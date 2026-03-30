<?php
// Community post delete → Move to trash
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$user_id = $_SESSION['user_id'];

if (!$data || !isset($data->post_id)) {
    echo json_encode(["success" => false, "message" => "post_id가 필요합니다."]);
    exit;
}

$post_id = intval($data->post_id);

try {
    // Auto-create trash_bin table (once per session)
    if (empty($_SESSION['_ddl_trash_bin'])) {
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
        $_SESSION['_ddl_trash_bin'] = true;
    }

    // Check ownership
    $stmt = $conn->prepare("SELECT * FROM community_posts WHERE id = ?");
    $stmt->execute([$post_id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        echo json_encode(["success" => false, "message" => "게시글을 찾을 수 없습니다."]);
        exit;
    }

    // Only allow deleting own posts (or admin)
    $user_role = $_SESSION['user_role'] ?? '';
    if (intval($post['user_id']) !== intval($user_id) && !in_array($user_role, ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "본인 게시글만 삭제할 수 있습니다."]);
        exit;
    }

    // Collect photo data for preservation
    $photos = [];
    try {
        $photoStmt = $conn->prepare("SELECT * FROM community_post_photos WHERE post_id = ?");
        $photoStmt->execute([$post_id]);
        $photos = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) { /* ignore */
    }

    // Build complete record data for trash
    $record_data = $post;
    $record_data['_photos'] = $photos;

    // Move to trash
    $insertTrash = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (:tn, :ri, :il, :rd, :db, :dn)");
    $insertTrash->execute([
        ':tn' => 'community_posts',
        ':ri' => $post_id,
        ':il' => mb_substr($post['content'] ?? '게시글', 0, 50),
        ':rd' => json_encode($record_data, JSON_UNESCAPED_UNICODE),
        ':db' => $user_id,
        ':dn' => $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'Unknown',
    ]);

    // Delete photos from DB (keep files on disk)
    try {
        $delPhotos = $conn->prepare("DELETE FROM community_post_photos WHERE post_id = ?");
        $delPhotos->execute([$post_id]);
    } catch (PDOException $e) { /* ignore */
    }

    // Delete post from DB
    $del = $conn->prepare("DELETE FROM community_posts WHERE id = ?");
    $del->execute([$post_id]);

    echo json_encode(["success" => true, "message" => "게시글이 휴지통으로 이동되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[community_delete] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "게시글 삭제 중 오류가 발생했습니다."]);
}
?>