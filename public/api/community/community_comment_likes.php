<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Create comment_likes table if not exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS community_comment_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_comment_user (comment_id, user_id),
        INDEX idx_comment (comment_id),
        INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // Table may already exist
}

header('Content-Type: application/json; charset=utf-8');

// POST - Toggle comment like
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->comment_id)) {
        echo json_encode(["success" => false, "message" => "comment_id is required."]);
        exit;
    }

    $comment_id = intval($data->comment_id);

    try {
        // Check if already liked
        $checkStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comment_likes WHERE user_id = ? AND comment_id = ?");
        $checkStmt->execute([$user_id, $comment_id]);
        $exists = intval($checkStmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0;

        if ($exists) {
            // Unlike
            $delStmt = $conn->prepare("DELETE FROM community_comment_likes WHERE user_id = ? AND comment_id = ?");
            $delStmt->execute([$user_id, $comment_id]);
        } else {
            // Like
            $insStmt = $conn->prepare("INSERT INTO community_comment_likes (user_id, comment_id) VALUES (?, ?)");
            $insStmt->execute([$user_id, $comment_id]);
        }

        // Return updated count
        $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comment_likes WHERE comment_id = ?");
        $countStmt->execute([$comment_id]);
        $likeCount = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        echo json_encode([
            "success" => true,
            "liked" => !$exists,
            "like_count" => $likeCount
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>