<?php
/**
 * check_service.php
 * 
 * Check if current logged-in user has access to a specific service.
 * 
 * GET: ?service=analytics_report
 * Returns: { success, hasAccess, service, start_date, end_date }
 * For priority_application also: { auto_apply, monthly_limit, monthly_used }
 * 
 * Admin/superadmin always have access.
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'hasAccess' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? '';
$service = $_GET['service'] ?? '';

// Admin/superadmin always have access
if (in_array($role, ['admin', 'superadmin'])) {
    echo json_encode(['success' => true, 'hasAccess' => true, 'role' => 'admin']);
    exit;
}

if (!$service) {
    echo json_encode(['success' => false, 'hasAccess' => false, 'message' => '서비스명이 필요합니다.']);
    exit;
}

// Auto-create table
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS user_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service VARCHAR(50) NOT NULL,
        enabled TINYINT(1) DEFAULT 0,
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        auto_apply TINYINT(1) DEFAULT 0,
        monthly_limit INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_service (user_id, service),
        INDEX (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) {
}

// Auto-migrate: add new columns
try {
    $conn->exec("ALTER TABLE user_services ADD COLUMN auto_apply TINYINT(1) DEFAULT 0");
} catch (Exception $e) {
}
try {
    $conn->exec("ALTER TABLE user_services ADD COLUMN monthly_limit INT DEFAULT 0");
} catch (Exception $e) {
}

// Auto-create fasttrack_usage table
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS fasttrack_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_id INT NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (used_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) {
}

try {
    $stmt = $conn->prepare("SELECT enabled, start_date, end_date, auto_apply, monthly_limit FROM user_services WHERE user_id = ? AND service = ?");
    $stmt->execute([$user_id, $service]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !$row['enabled']) {
        echo json_encode(['success' => true, 'hasAccess' => false]);
        exit;
    }

    // Check date validity
    $now = date('Y-m-d');
    if ($row['end_date'] && $now > $row['end_date']) {
        echo json_encode(['success' => true, 'hasAccess' => false, 'expired' => true]);
        exit;
    }
    if ($row['start_date'] && $now < $row['start_date']) {
        echo json_encode(['success' => true, 'hasAccess' => false, 'notStarted' => true]);
        exit;
    }

    $response = [
        'success' => true,
        'hasAccess' => true,
        'start_date' => $row['start_date'],
        'end_date' => $row['end_date']
    ];

    // For priority_application, include usage info
    if ($service === 'priority_application') {
        $response['auto_apply'] = intval($row['auto_apply'] ?? 0);
        $response['monthly_limit'] = intval($row['monthly_limit'] ?? 0);

        // Count this month's usage
        $monthStart = date('Y-m-01');
        $usageStmt = $conn->prepare("SELECT COUNT(*) FROM fasttrack_usage WHERE user_id = ? AND used_at >= ?");
        $usageStmt->execute([$user_id, $monthStart]);
        $response['monthly_used'] = intval($usageStmt->fetchColumn());
    }

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'hasAccess' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>