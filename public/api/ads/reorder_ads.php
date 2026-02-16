<?php
// Admin: Reorder ads (update priority)
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '512M');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['orders']) || !is_array($input['orders'])) {
    echo json_encode(['success' => false, 'message' => 'orders array required']);
    exit();
}

try {
    $conn->beginTransaction();
    $stmt = $conn->prepare("UPDATE ads SET priority = :priority WHERE id = :id");

    foreach ($input['orders'] as $item) {
        $stmt->execute([
            ':priority' => intval($item['priority']),
            ':id' => intval($item['id'])
        ]);
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => '광고 순서가 변경되었습니다.']);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>