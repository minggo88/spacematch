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

if (!$data || !isset($data->post_id)) {
    echo json_encode(["success" => false, "message" => "post_id가 필요합니다."]);
    exit;
}

$post_id = intval($data->post_id);

try {
    // Check ownership
    $stmt = $conn->prepare("SELECT id, user_id FROM community_posts WHERE id = ?");
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

    // Delete associated photos
    try {
        $photoStmt = $conn->prepare("SELECT image_url FROM community_post_photos WHERE post_id = ?");
        $photoStmt->execute([$post_id]);
        $photos = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($photos as $photo) {
            $filePath = "../../" . ltrim(str_replace('/spacematch/', '', $photo['image_url']), '/');
            if (file_exists($filePath))
                @unlink($filePath);
        }
        $delPhotos = $conn->prepare("DELETE FROM community_post_photos WHERE post_id = ?");
        $delPhotos->execute([$post_id]);
    } catch (PDOException $e) { /* ignore */
    }

    $del = $conn->prepare("DELETE FROM community_posts WHERE id = ?");
    $del->execute([$post_id]);

    echo json_encode(["success" => true, "message" => "게시글이 삭제되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>