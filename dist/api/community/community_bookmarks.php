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

// Create bookmarks table if not exists (once per session)
if (empty($_SESSION['_ddl_community_bookmarks'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS community_bookmarks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            post_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_bookmark (user_id, post_id),
            INDEX idx_user (user_id),
            INDEX idx_post (post_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        $_SESSION['_ddl_community_bookmarks'] = true;
    } catch (PDOException $e) {
        // Table may already exist
    }
}

header('Content-Type: application/json; charset=utf-8');

// GET - Fetch user's bookmarks or check bookmark status
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;

    // If post_id given, check if bookmarked
    if ($post_id > 0) {
        $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_bookmarks WHERE user_id = ? AND post_id = ?");
        $stmt->execute([$user_id, $post_id]);
        $is_bookmarked = intval($stmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0;
        echo json_encode(["success" => true, "is_bookmarked" => $is_bookmarked]);
        exit;
    }

    // Otherwise, fetch all bookmarked posts for this user
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $where = "b.user_id = ?";
    $params = [$user_id];

    if (!empty($type)) {
        $where .= " AND p.community_type = ?";
        $params[] = $type;
    }

    try {
        $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_bookmarks b JOIN community_posts p ON b.post_id = p.id WHERE $where");
        $countStmt->execute($params);
        $total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        $stmt = $conn->prepare("SELECT p.id, p.user_id, u.name AS user_name, u.name_en AS user_name_en, u.role AS user_role, u.profile_image, u.country, p.label, p.title, p.content, p.original_lang, p.view_count, p.community_type, p.created_at,
                                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id) as like_count,
                                (SELECT COUNT(*) FROM community_post_likes WHERE post_id = p.id AND user_id = ?) as is_liked,
                                (SELECT COUNT(*) FROM community_comments WHERE post_id = p.id) as comment_count,
                                b.created_at as bookmarked_at
                                FROM community_bookmarks b
                                JOIN community_posts p ON b.post_id = p.id
                                JOIN users u ON p.user_id = u.id
                                WHERE $where
                                ORDER BY b.created_at DESC
                                LIMIT " . intval($limit) . " OFFSET " . intval($offset));
        $stmt->execute(array_merge([$user_id], $params));
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Attach photos
        $photoStmt = $conn->prepare("SELECT id, image_url, sort_order FROM community_post_photos WHERE post_id = ? ORDER BY sort_order ASC");
        foreach ($posts as &$post) {
            $post['id'] = intval($post['id']);
            $post['user_id'] = intval($post['user_id']);
            $post['view_count'] = intval($post['view_count']);
            $post['like_count'] = intval($post['like_count']);
            $post['is_liked'] = intval($post['is_liked']) > 0;
            $post['is_bookmarked'] = true;
            $post['is_mine'] = ($post['user_id'] === intval($user_id));
            $post['keywords'] = !empty($post['keywords']) ? json_decode($post['keywords'], true) : [];
            $photoStmt->execute([$post['id']]);
            $post['photos'] = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            "success" => true,
            "posts" => $posts,
            "total" => $total,
            "page" => $page,
            "totalPages" => max(1, ceil($total / $limit))
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "오류가 발생했습니다."]);
    }
    exit;
}

// POST - Toggle bookmark
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->post_id)) {
        echo json_encode(["success" => false, "message" => "post_id is required."]);
        exit;
    }

    $post_id = intval($data->post_id);

    try {
        // Check if already bookmarked
        $checkStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_bookmarks WHERE user_id = ? AND post_id = ?");
        $checkStmt->execute([$user_id, $post_id]);
        $exists = intval($checkStmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0;

        if ($exists) {
            // Remove bookmark
            $delStmt = $conn->prepare("DELETE FROM community_bookmarks WHERE user_id = ? AND post_id = ?");
            $delStmt->execute([$user_id, $post_id]);
            echo json_encode(["success" => true, "bookmarked" => false]);
        } else {
            // Add bookmark
            $insStmt = $conn->prepare("INSERT INTO community_bookmarks (user_id, post_id) VALUES (?, ?)");
            $insStmt->execute([$user_id, $post_id]);
            echo json_encode(["success" => true, "bookmarked" => true]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "오류가 발생했습니다."]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>