<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Only admin/superadmin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "관리자 권한이 필요합니다."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->user_id)) {
    echo json_encode(["success" => false, "message" => "user_id가 필요합니다."]);
    exit;
}

$user_id = intval($data->user_id);
$featured = isset($data->is_featured) ? intval($data->is_featured) : 0;

try {
    // Ensure column exists
    try {
        $conn->exec("ALTER TABLE users ADD COLUMN is_featured TINYINT(1) DEFAULT 0");
    } catch (PDOException $e) { /* already exists */
    }

    $stmt = $conn->prepare("UPDATE users SET is_featured = ? WHERE id = ?");
    $stmt->execute([$featured, $user_id]);

    echo json_encode(["success" => true, "message" => $featured ? "상위 노출이 설정되었습니다." : "상위 노출이 해제되었습니다."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>