<?php
/**
 * get_campaigns.php — 이메일 캠페인 발송 이력 조회
 * GET: optional ?limit=20
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=UTF-8');

if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // Ensure table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS email_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject VARCHAR(500) NOT NULL,
        html_body LONGTEXT,
        cta_text VARCHAR(200),
        cta_url VARCHAR(500),
        image_url VARCHAR(500),
        target_role VARCHAR(20) DEFAULT 'all',
        total_recipients INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        sent_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    $limit = max(1, min($limit, 200));

    $stmt = $conn->prepare("
        SELECT ec.*, u.name as sender_name, u.email as sender_email
        FROM email_campaigns ec
        LEFT JOIN users u ON u.id = ec.sent_by
        ORDER BY ec.created_at DESC
        LIMIT ?
    ");
    $stmt->execute([$limit]);
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get recipient count for preview
    $col_ev = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
    $has_ev = $col_ev->fetch() ? true : false;
    $evCondition = $has_ev ? "AND u.email_verified = 1" : "";

    $counts = [];
    foreach (['all', 'seller', 'host', 'vendor'] as $role) {
        $roleFilter = $role !== 'all' ? "AND u.role = '$role'" : "";
        $countStmt = $conn->query("
            SELECT COUNT(*) as cnt FROM users u 
            WHERE u.email IS NOT NULL AND u.email != '' 
            AND u.status = 'active'
            {$evCondition}
            AND u.role NOT IN ('admin', 'superadmin')
            {$roleFilter}
            AND u.id NOT IN (
                SELECT ns.user_id FROM notification_settings ns 
                WHERE ns.cat_marketing = 0 OR ns.email_enabled = 0
            )
        ");
        $row = $countStmt->fetch(PDO::FETCH_ASSOC);
        $counts[$role] = intval($row['cnt'] ?? 0);
    }

    echo json_encode([
        'success' => true,
        'campaigns' => $campaigns,
        'recipient_counts' => $counts
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '오류: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>