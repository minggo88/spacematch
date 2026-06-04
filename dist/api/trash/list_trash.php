<?php
// List items in trash bin
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
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

    $table_filter = $_GET['table_name'] ?? '';
    $search = $_GET['search'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $per_page = 20;
    $offset = ($page - 1) * $per_page;

    $where = '1=1';
    $params = [];

    if ($table_filter) {
        $where .= ' AND table_name = :table_name';
        $params[':table_name'] = $table_filter;
    }

    if ($search) {
        $where .= ' AND (item_label LIKE :search OR table_name LIKE :search2)';
        $params[':search'] = "%$search%";
        $params[':search2'] = "%$search%";
    }

    // Total count
    $countStmt = $conn->prepare("SELECT COUNT(*) FROM trash_bin WHERE $where");
    $countStmt->execute($params);
    $total = intval($countStmt->fetchColumn());

    // Fetch items
    $listStmt = $conn->prepare("SELECT id, table_name, record_id, item_label, deleted_by, deleted_by_name, deleted_at FROM trash_bin WHERE $where ORDER BY deleted_at DESC LIMIT $per_page OFFSET $offset");
    $listStmt->execute($params);
    $items = $listStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get distinct table names for filter
    $tablesStmt = $conn->query("SELECT DISTINCT table_name FROM trash_bin ORDER BY table_name");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'items' => $items,
        'total' => $total,
        'page' => $page,
        'per_page' => $per_page,
        'tables' => $tables,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>