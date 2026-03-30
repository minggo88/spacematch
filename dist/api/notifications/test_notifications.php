<?php
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Superadmin 전용 진단 엔드포인트
if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => '접근 권한이 없습니다.']);
    exit;
}

// Diagnostic endpoint for notification system
$result = [
    "test" => "notification_system_diagnostic",
    "timestamp" => date('Y-m-d H:i:s'),
    "session_user_id" => $_SESSION['user_id'] ?? null,
];

// 1. Check if notifications table exists
try {
    $tableCheck = $conn->query("SHOW TABLES LIKE 'notifications'");
    $result["table_exists"] = $tableCheck->rowCount() > 0;
} catch (Exception $e) {
    $result["table_exists_error"] = "check failed";
}

// 2. Try to create it if not exists, and ensure 'link' column exists
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

    // Auto-fix: add 'link' column if missing (table may have been created with older schema)
    $colCheck = $conn->query("SHOW COLUMNS FROM notifications LIKE 'link'");
    if ($colCheck->rowCount() === 0) {
        $conn->exec("ALTER TABLE notifications ADD COLUMN link VARCHAR(255) DEFAULT NULL AFTER message");
        $result["link_column_added"] = true;
    } else {
        $result["link_column_exists"] = true;
    }
    $result["table_exists"] = true;
} catch (Exception $e) {
    $result["table_fix_error"] = "fix failed";
}

// 3. Count total notifications in table
try {
    $countStmt = $conn->query("SELECT COUNT(*) as total FROM notifications");
    $result["total_notifications"] = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total']);
} catch (Exception $e) {
    $result["count_error"] = "count failed";
}

// 4. Count notifications for current user
if (isset($_SESSION['user_id'])) {
    try {
        $userCountStmt = $conn->prepare("SELECT COUNT(*) as total FROM notifications WHERE user_id = ?");
        $userCountStmt->execute([$_SESSION['user_id']]);
        $result["user_notifications"] = intval($userCountStmt->fetch(PDO::FETCH_ASSOC)['total']);
    } catch (Exception $e) {
        $result["user_count_error"] = "count failed";
    }

    // 5. Show latest 5 notifications for current user
    try {
        $latestStmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5");
        $latestStmt->execute([$_SESSION['user_id']]);
        $result["latest_notifications"] = $latestStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $result["latest_error"] = "query failed";
    }
}

// 6. Try inserting a test notification for current user
if (isset($_SESSION['user_id']) && isset($_GET['insert_test'])) {
    try {
        $testStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link, created_at) VALUES (?, 'test', '테스트 알림입니다. 이 알림이 보이면 알림 시스템이 정상 작동합니다.', '/community', NOW())");
        $testStmt->execute([$_SESSION['user_id']]);
        $result["test_insert"] = "SUCCESS - ID: " . $conn->lastInsertId();
    } catch (Exception $e) {
        $result["test_insert_error"] = "insert failed";
    }
}

// 7. List all users count for notification targeting
try {
    $userCountStmt = $conn->query("SELECT role, COUNT(*) as cnt FROM users GROUP BY role");
    $result["users_by_role"] = $userCountStmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $result["users_count_error"] = "count failed";
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>