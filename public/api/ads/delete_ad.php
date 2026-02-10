<?php
// Admin: Delete ad
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($data['id']) ? intval($data['id']) : 0;

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'id required']);
    exit();
}

try {
    // Delete image file
    $stmt = $conn->prepare("SELECT image_url FROM ads WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($ad && $ad['image_url']) {
        $path = $_SERVER['DOCUMENT_ROOT'] . $ad['image_url'];
        if (file_exists($path))
            @unlink($path);
    }

    $del = $conn->prepare("DELETE FROM ads WHERE id = :id");
    $del->execute([':id' => $ad_id]);

    echo json_encode(['success' => true, 'message' => '광고가 삭제되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>