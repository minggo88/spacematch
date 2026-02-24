<?php
// Universal Move-to-Trash API
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$table_name = $data['table_name'] ?? '';
$record_id = $data['record_id'] ?? '';
$record_data = $data['record_data'] ?? null;
$item_label = $data['item_label'] ?? '';

if (empty($table_name) || empty($record_id)) {
    echo json_encode(['success' => false, 'message' => 'table_name과 record_id가 필요합니다.']);
    exit;
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

    // If record_data not provided, try to fetch it from the original table
    if (empty($record_data)) {
        try {
            $fetchStmt = $conn->prepare("SELECT * FROM `$table_name` WHERE id = :id LIMIT 1");
            $fetchStmt->execute([':id' => $record_id]);
            $record_data = $fetchStmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Table might not have 'id' column; proceed with null data
            $record_data = null;
        }
    }

    // Get deleter info
    $deleted_by = $_SESSION['user_id'];
    $deleted_by_name = $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'Unknown';

    // Insert into trash_bin
    $insertStmt = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (:table_name, :record_id, :item_label, :record_data, :deleted_by, :deleted_by_name)");
    $insertStmt->execute([
        ':table_name' => $table_name,
        ':record_id' => $record_id,
        ':item_label' => $item_label,
        ':record_data' => $record_data ? json_encode($record_data, JSON_UNESCAPED_UNICODE) : null,
        ':deleted_by' => $deleted_by,
        ':deleted_by_name' => $deleted_by_name,
    ]);

    echo json_encode(['success' => true, 'message' => '휴지통으로 이동되었습니다.', 'trash_id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>