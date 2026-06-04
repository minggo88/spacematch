<?php
// Superadmin: Get active users and total user stats
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'superadmin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Superadmin only']);
    exit;
}

try {
    // Ensure last_active_at column exists
    $colCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'last_active_at'");
    if (!$colCheck->fetch()) {
        $conn->exec("ALTER TABLE users ADD COLUMN last_active_at DATETIME NULL DEFAULT NULL");
    }

    // Total user counts by role
    $totalStmt = $conn->query("SELECT role, COUNT(*) as cnt FROM users GROUP BY role");
    $roleCounts = [];
    $totalUsers = 0;
    while ($r = $totalStmt->fetch(PDO::FETCH_ASSOC)) {
        $roleCounts[$r['role']] = intval($r['cnt']);
        $totalUsers += intval($r['cnt']);
    }

    // Online users (active within last 20 minutes — covers the 15-min heartbeat window)
    $onlineStmt = $conn->query("SELECT id, name, email, role, profile_image, last_active_at FROM users WHERE last_active_at >= DATE_SUB(NOW(), INTERVAL 20 MINUTE) ORDER BY last_active_at DESC");
    $onlineUsers = $onlineStmt->fetchAll(PDO::FETCH_ASSOC);

    // Recently active (active within last 24 hours but not currently online)
    $recentStmt = $conn->query("SELECT id, name, email, role, profile_image, last_active_at FROM users WHERE last_active_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) AND last_active_at < DATE_SUB(NOW(), INTERVAL 20 MINUTE) ORDER BY last_active_at DESC LIMIT 50");
    $recentUsers = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'total_users' => $totalUsers,
        'role_counts' => $roleCounts,
        'online_count' => count($onlineUsers),
        'online_users' => $onlineUsers,
        'recent_count' => count($recentUsers),
        'recent_users' => $recentUsers,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>