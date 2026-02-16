<?php
// Permanently delete item from trash bin
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$trash_id = isset($data['id']) ? intval($data['id']) : 0;
$batch_ids = $data['ids'] ?? [];

try {
    if (!empty($batch_ids)) {
        // Batch permanent delete
        $placeholders = implode(',', array_fill(0, count($batch_ids), '?'));
        $stmt = $conn->prepare("DELETE FROM trash_bin WHERE id IN ($placeholders)");
        $stmt->execute(array_map('intval', $batch_ids));
        echo json_encode(['success' => true, 'message' => count($batch_ids) . '개 항목이 영구 삭제되었습니다.']);
    } else if ($trash_id > 0) {
        // Single permanent delete
        $stmt = $conn->prepare("DELETE FROM trash_bin WHERE id = :id");
        $stmt->execute([':id' => $trash_id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => '영구 삭제되었습니다.']);
        } else {
            echo json_encode(['success' => false, 'message' => '항목을 찾을 수 없습니다.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'id 또는 ids가 필요합니다.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>