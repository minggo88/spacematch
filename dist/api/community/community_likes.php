<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Ensure tables exist
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS community_post_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_post_user (post_id, user_id),
        INDEX idx_post_id (post_id)
    )");
    $conn->exec("CREATE TABLE IF NOT EXISTS community_comment_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_comment_user (comment_id, user_id),
        INDEX idx_comment_id (comment_id)
    )");
} catch (PDOException $e) {
    // Tables might already exist
}

// POST - Toggle like (post or comment)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $post_id = isset($input['post_id']) ? intval($input['post_id']) : 0;
    $comment_id = isset($input['comment_id']) ? intval($input['comment_id']) : 0;

    // Comment like
    if ($comment_id > 0) {
        try {
            $checkStmt = $conn->prepare("SELECT id FROM community_comment_likes WHERE comment_id = ? AND user_id = ?");
            $checkStmt->execute([$comment_id, $user_id]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $conn->prepare("DELETE FROM community_comment_likes WHERE comment_id = ? AND user_id = ?")->execute([$comment_id, $user_id]);
                $liked = false;
            } else {
                $conn->prepare("INSERT INTO community_comment_likes (comment_id, user_id) VALUES (?, ?)")->execute([$comment_id, $user_id]);
                $liked = true;
            }

            $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comment_likes WHERE comment_id = ?");
            $countStmt->execute([$comment_id]);
            $like_count = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

            echo json_encode(["success" => true, "liked" => $liked, "like_count" => $like_count]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
        }
        exit;
    }

    // Post like
    if ($post_id <= 0) {
        echo json_encode(["success" => false, "message" => "post_id 또는 comment_id가 필요합니다."]);
        exit;
    }

    try {
        $checkStmt = $conn->prepare("SELECT id FROM community_post_likes WHERE post_id = ? AND user_id = ?");
        $checkStmt->execute([$post_id, $user_id]);
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            $conn->prepare("DELETE FROM community_post_likes WHERE post_id = ? AND user_id = ?")->execute([$post_id, $user_id]);
            $liked = false;
        } else {
            $conn->prepare("INSERT INTO community_post_likes (post_id, user_id) VALUES (?, ?)")->execute([$post_id, $user_id]);
            $liked = true;
        }

        $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_post_likes WHERE post_id = ?");
        $countStmt->execute([$post_id]);
        $like_count = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        echo json_encode(["success" => true, "liked" => $liked, "like_count" => $like_count]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

// PUT - Increment view count (unique per user)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $post_id = isset($input['post_id']) ? intval($input['post_id']) : 0;

    if ($post_id <= 0) {
        echo json_encode(["success" => false, "message" => "post_id가 필요합니다."]);
        exit;
    }

    try {
        // Check if user already viewed this post
        $checkStmt = $conn->prepare("SELECT id FROM community_post_views WHERE post_id = ? AND user_id = ?");
        $checkStmt->execute([$post_id, $user_id]);
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            // First view by this user — record it and increment
            $conn->prepare("INSERT INTO community_post_views (post_id, user_id) VALUES (?, ?)")->execute([$post_id, $user_id]);
            $conn->prepare("UPDATE community_posts SET view_count = view_count + 1 WHERE id = ?")->execute([$post_id]);
            echo json_encode(["success" => true, "new_view" => true]);
        } else {
            // Already viewed — do nothing
            echo json_encode(["success" => true, "new_view" => false]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid method"]);
