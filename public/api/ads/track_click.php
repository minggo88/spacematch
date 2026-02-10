<?php
// Public: Track ad click
include_once '../db_connect.php';
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($data['ad_id']) ? intval($data['ad_id']) : 0;

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ad_id required']);
    exit();
}

try {
    $stmt = $conn->prepare("UPDATE ads SET clicks = clicks + 1 WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>