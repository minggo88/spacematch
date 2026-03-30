<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
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

// GET - Fetch popular posts (top 5 within last 7 days)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type = isset($_GET['type']) ? $_GET['type'] : 'general';
    $country_filter = isset($_GET['country']) ? trim($_GET['country']) : '';

    if (!in_array($type, ['seller', 'host', 'general'])) {
        echo json_encode(["success" => false, "message" => "Invalid community type"]);
        exit;
    }

    try {
        // Composite score: (likes*2 + comments*3 + views*0.1) / (hours+2)^1.5
        // Only posts from last 7 days
        $countryWhere = '';
        $countryParams = [];
        if (!empty($country_filter) && $country_filter !== 'all') {
            $countryWhere = ' AND p.country = ?';
            $countryParams[] = $country_filter;
        }

        $stmt = $conn->prepare("
            SELECT 
                p.id, p.user_id, u.name AS user_name, u.role AS user_role, u.profile_image, 
                p.label, p.title, p.content, p.view_count, p.created_at,
                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count,
                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                (
                    (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) * 2 +
                    (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) * 3 +
                    p.view_count * 0.1
                ) / POWER(TIMESTAMPDIFF(HOUR, p.created_at, NOW()) + 2, 1.5) as popularity_score
            FROM community_posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.community_type = ?
              AND p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
              {$countryWhere}
            ORDER BY popularity_score DESC
            LIMIT 5
        ");
        $stmt->execute(array_merge([$user_id, $type], $countryParams));
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Attach photos
        $photoStmt = $conn->prepare("SELECT id, image_url, sort_order FROM community_post_photos WHERE post_id = ? ORDER BY sort_order ASC");
        foreach ($posts as &$post) {
            $post['id'] = intval($post['id']);
            $post['user_id'] = intval($post['user_id']);
            $post['view_count'] = intval($post['view_count']);
            $post['like_count'] = intval($post['like_count']);
            $post['comment_count'] = intval($post['comment_count']);
            $post['is_liked'] = intval($post['is_liked']) > 0;
            $post['popularity_score'] = round(floatval($post['popularity_score']), 4);
            $photoStmt->execute([$post['id']]);
            $post['photos'] = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            "success" => true,
            "posts" => $posts
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[community_popular] ' . $e->getMessage());
        echo json_encode(["success" => false, "message" => "오류가 발생했습니다."]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid method"]);
