<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$user_id = $_SESSION['user_id'];

// GET - Fetch activity stats for a user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $target_user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : intval($user_id);

    try {
        // Count posts
        $postStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE user_id = ?");
        $postStmt->execute([$target_user_id]);
        $postCount = intval($postStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Count comments
        $commentStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comments WHERE user_id = ?");
        $commentStmt->execute([$target_user_id]);
        $commentCount = intval($commentStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Count received likes (on user's posts)
        $likeStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_post_likes l JOIN community_posts p ON l.post_id = p.id WHERE p.user_id = ?");
        $likeStmt->execute([$target_user_id]);
        $receivedLikes = intval($likeStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Calculate total activity score
        $totalActivity = $postCount * 3 + $commentCount * 1 + $receivedLikes * 1;

        // Determine level
        $level = 1;
        $levelName = 'sprout';
        $levelEmoji = '🌱';
        if ($totalActivity >= 100) {
            $level = 5;
            $levelName = 'legend';
            $levelEmoji = '👑';
        } elseif ($totalActivity >= 50) {
            $level = 4;
            $levelName = 'star';
            $levelEmoji = '⭐';
        } elseif ($totalActivity >= 20) {
            $level = 3;
            $levelName = 'tree';
            $levelEmoji = '🌳';
        } elseif ($totalActivity >= 5) {
            $level = 2;
            $levelName = 'growing';
            $levelEmoji = '🌿';
        }

        echo json_encode([
            "success" => true,
            "activity" => [
                "user_id" => $target_user_id,
                "post_count" => $postCount,
                "comment_count" => $commentCount,
                "received_likes" => $receivedLikes,
                "total_activity" => $totalActivity,
                "level" => $level,
                "level_name" => $levelName,
                "level_emoji" => $levelEmoji,
            ]
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