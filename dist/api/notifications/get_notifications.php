<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

// Auto-create notifications table if not exists (once per session)
if (empty($_SESSION['_ddl_notifications'])) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            type VARCHAR(50) NOT NULL, 
            message TEXT NOT NULL,
            link VARCHAR(255),
            is_read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id),
            INDEX (is_read)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // Ensure 'link' column exists (may be missing if table was created with older schema)
        $colCheck = $conn->query("SHOW COLUMNS FROM notifications LIKE 'link'");
        if ($colCheck->rowCount() === 0) {
            $conn->exec("ALTER TABLE notifications ADD COLUMN link VARCHAR(255) DEFAULT NULL AFTER message");
        }
        $_SESSION['_ddl_notifications'] = true;
    } catch (PDOException $e) {
        // Table likely already exists
    }
}

$user_id = $_SESSION['user_id'];
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;

try {
    $query = "SELECT * FROM notifications 
              WHERE user_id = :user_id 
              ORDER BY created_at DESC 
              LIMIT :limit";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notifications);

    error_log('[get_notifications] ' . $e->getMessage());
    echo json_encode([]);
}
?>