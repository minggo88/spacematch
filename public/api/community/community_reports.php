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

// Create reports table if not exists (once per session)
if (empty($_SESSION['_ddl_community_reports'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS community_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reporter_id INT NOT NULL,
            post_id INT NOT NULL,
            reason VARCHAR(50) NOT NULL,
            detail TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_report (reporter_id, post_id),
            INDEX idx_post (post_id),
            INDEX idx_reporter (reporter_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        $_SESSION['_ddl_community_reports'] = true;
    } catch (PDOException $e) {
        // Table may already exist
    }
}

header('Content-Type: application/json; charset=utf-8');

// GET - Check if user already reported this post
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;
    if ($post_id <= 0) {
        echo json_encode(["success" => false, "message" => "post_id is required."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_reports WHERE reporter_id = ? AND post_id = ?");
    $stmt->execute([$user_id, $post_id]);
    $already_reported = intval($stmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0;

    // Report count for admins
    $countStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_reports WHERE post_id = ?");
    $countStmt->execute([$post_id]);
    $report_count = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

    echo json_encode([
        "success" => true,
        "already_reported" => $already_reported,
        "report_count" => $report_count
    ]);
    exit;
}

// POST - Submit report
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->post_id) || !isset($data->reason)) {
        echo json_encode(["success" => false, "message" => "post_id and reason are required."]);
        exit;
    }

    $post_id = intval($data->post_id);
    $reason = trim($data->reason);
    $detail = isset($data->detail) ? trim($data->detail) : null;

    // Valid reasons
    $validReasons = ['spam', 'inappropriate', 'advertising', 'other'];
    if (!in_array($reason, $validReasons)) {
        echo json_encode(["success" => false, "message" => "Invalid reason."]);
        exit;
    }

    // Check if user is reporting their own post
    $postStmt = $conn->prepare("SELECT user_id FROM community_posts WHERE id = ?");
    $postStmt->execute([$post_id]);
    $postOwner = $postStmt->fetch(PDO::FETCH_ASSOC);
    if ($postOwner && intval($postOwner['user_id']) === intval($user_id)) {
        echo json_encode(["success" => false, "message" => "본인 게시글은 신고할 수 없습니다."]);
        exit;
    }

    try {
        // Check for duplicate report
        $checkStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_reports WHERE reporter_id = ? AND post_id = ?");
        $checkStmt->execute([$user_id, $post_id]);
        if (intval($checkStmt->fetch(PDO::FETCH_ASSOC)['cnt']) > 0) {
            echo json_encode(["success" => false, "message" => "이미 신고한 게시글입니다."]);
            exit;
        }

        $insStmt = $conn->prepare("INSERT INTO community_reports (reporter_id, post_id, reason, detail) VALUES (?, ?, ?, ?)");
        $insStmt->execute([$user_id, $post_id, $reason, $detail]);

        echo json_encode(["success" => true, "message" => "신고가 접수되었습니다."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "오류가 발생했습니다."]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>