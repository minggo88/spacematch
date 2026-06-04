<?php
// Admin: Delete ad → Move to trash
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
    // Auto-create trash_bin table
    $conn->exec("CREATE TABLE IF NOT EXISTS trash_bin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        record_id VARCHAR(100) NOT NULL,
        item_label VARCHAR(255) DEFAULT '',
        record_data JSON NULL,
        deleted_by INT NULL,
        deleted_by_name VARCHAR(100) DEFAULT '',
        deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_table (table_name),
        INDEX idx_deleted_at (deleted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Fetch full ad data before deleting
    $stmt = $conn->prepare("SELECT * FROM ads WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ad) {
        echo json_encode(['success' => false, 'message' => 'Ad not found.']);
        exit();
    }

    // Move to trash (save full record data, keep image file on disk)
    $insertTrash = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (:tn, :ri, :il, :rd, :db, :dn)");
    $insertTrash->execute([
        ':tn' => 'ads',
        ':ri' => $ad_id,
        ':il' => $ad['title'] ?? '광고 #' . $ad_id,
        ':rd' => json_encode($ad, JSON_UNESCAPED_UNICODE),
        ':db' => $_SESSION['user_id'],
        ':dn' => $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'Admin',
    ]);

    // Delete from ads table (image file is preserved for restoration)
    $del = $conn->prepare("DELETE FROM ads WHERE id = :id");
    $del->execute([':id' => $ad_id]);

    echo json_encode(['success' => true, 'message' => '광고가 휴지통으로 이동되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>