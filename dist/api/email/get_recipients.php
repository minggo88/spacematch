<?php
/**
 * get_recipients.php — 이메일 발송 대상 목록 조회
 * GET: ?role=all|seller|host|vendor
 * 이메일 인증 완료 사용자 전체 + 수신 동의 여부 표시
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
    // Ensure cat_marketing column exists
    try {
        $conn->exec("ALTER TABLE notification_settings ADD COLUMN cat_marketing TINYINT(1) DEFAULT 1");
    } catch (Exception $e) { /* already exists */
    }

    $targetRole = $_GET['role'] ?? 'all';

    // Check if email_verified column exists
    $col_ev = $conn->query("SHOW COLUMNS FROM users LIKE 'email_verified'");
    $has_ev = $col_ev->fetch() ? true : false;
    $evCondition = $has_ev ? "AND u.email_verified = 1" : "";

    $roleFilter = '';
    $params = [];
    if ($targetRole !== 'all') {
        $roleFilter = 'AND u.role = ?';
        $params[] = $targetRole;
    }

    $sql = "SELECT u.id, u.name, u.email, u.role, u.country, u.created_at,
                   COALESCE(ns.email_enabled, 1) as email_enabled,
                   COALESCE(ns.cat_marketing, 1) as cat_marketing
            FROM users u
            LEFT JOIN notification_settings ns ON ns.user_id = u.id
            WHERE u.email IS NOT NULL
            AND u.email != ''
            AND u.status = 'active'
            {$evCondition}
            AND u.role NOT IN ('admin', 'superadmin')
            {$roleFilter}
            ORDER BY u.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add marketing_opt_in flag for easy frontend use
    foreach ($users as &$u) {
        $u['marketing_opt_in'] = ((int) $u['email_enabled'] === 1 && (int) $u['cat_marketing'] === 1);
    }

    echo json_encode([
        'success' => true,
        'recipients' => $users,
        'total' => count($users)
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        'message' => '서버 오류가 발생했습니다.'
    ], JSON_UNESCAPED_UNICODE);
}
?>