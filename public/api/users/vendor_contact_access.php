<?php
/**
 * Seller's Vendor Contact Access Management API
 * Mirror of seller_contact_access.php but for sellers viewing vendors
 * 
 * GET: Check seller's current access permission & remaining views
 * POST (admin only): Set seller's vendor contact viewing permission
 */
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$current_user_id = $_SESSION['user_id'];
$current_role = $_SESSION['user_role'] ?? '';

// Ensure tables exist
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_vendor_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL UNIQUE,
        can_view_contacts TINYINT(1) DEFAULT 0,
        monthly_limit INT DEFAULT 0,
        access_start DATE DEFAULT NULL,
        access_end DATE DEFAULT NULL,
        updated_by INT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_seller_id (seller_id)
    )");

    $conn->exec("CREATE TABLE IF NOT EXISTS vendor_contact_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        vendor_id INT NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_seller_month (seller_id, viewed_at),
        UNIQUE KEY uk_seller_vendor (seller_id, vendor_id, viewed_at)
    )");
} catch (PDOException $e) { /* tables exist */
}

// GET: Check access status
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : $current_user_id;

    // Only admins can check other sellers
    if ($seller_id !== $current_user_id && !in_array($current_role, ['admin', 'superadmin'])) {
        $seller_id = $current_user_id;
    }

    try {
        $stmt = $conn->prepare("SELECT can_view_contacts, monthly_limit, access_start, access_end FROM seller_vendor_access WHERE seller_id = ?");
        $stmt->execute([$seller_id]);
        $access = $stmt->fetch(PDO::FETCH_ASSOC);

        $can_view = $access ? intval($access['can_view_contacts']) : 0;
        $monthly_limit = $access ? intval($access['monthly_limit']) : 0;
        $access_start = $access ? ($access['access_start'] ?? null) : null;
        $access_end = $access ? ($access['access_end'] ?? null) : null;

        $today = date('Y-m-d');
        $is_expired = ($can_view && $access_end && $today > $access_end);
        $is_not_started = ($can_view && $access_start && $today < $access_start);

        // Count views
        if ($access_start && $access_end) {
            $viewStmt = $conn->prepare("SELECT COUNT(DISTINCT vendor_id) as used FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ? AND viewed_at <= ?");
            $viewStmt->execute([$seller_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        } else {
            $month_start = date('Y-m-01 00:00:00');
            $viewStmt = $conn->prepare("SELECT COUNT(DISTINCT vendor_id) as used FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ?");
            $viewStmt->execute([$seller_id, $month_start]);
        }
        $used = intval($viewStmt->fetch(PDO::FETCH_ASSOC)['used']);

        // Viewed vendor IDs
        if ($access_start && $access_end) {
            $viewedStmt = $conn->prepare("SELECT DISTINCT vendor_id FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ? AND viewed_at <= ?");
            $viewedStmt->execute([$seller_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        } else {
            $month_start = date('Y-m-01 00:00:00');
            $viewedStmt = $conn->prepare("SELECT DISTINCT vendor_id FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ?");
            $viewedStmt->execute([$seller_id, $month_start]);
        }
        $viewed_vendors = $viewedStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "success" => true,
            "can_view_contacts" => $can_view,
            "monthly_limit" => $monthly_limit,
            "access_start" => $access_start,
            "access_end" => $access_end,
            "is_expired" => $is_expired,
            "is_not_started" => $is_not_started,
            "used_this_period" => $used,
            "remaining" => max(0, $monthly_limit - $used),
            "viewed_vendor_ids" => array_map('intval', $viewed_vendors)
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

// POST: Admin sets seller access permissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!in_array($current_role, ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "관리자 권한이 필요합니다."]);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $seller_id = intval($input['seller_id'] ?? 0);
    $can_view = intval($input['can_view_contacts'] ?? 0);
    $monthly_limit = intval($input['monthly_limit'] ?? 0);
    $start_date = isset($input['start_date']) && $input['start_date'] ? $input['start_date'] : null;
    $end_date = isset($input['end_date']) && $input['end_date'] ? $input['end_date'] : null;

    if ($seller_id <= 0) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 셀러 ID입니다."]);
        exit;
    }

    if (!$can_view) {
        $start_date = null;
        $end_date = null;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO seller_vendor_access (seller_id, can_view_contacts, monthly_limit, access_start, access_end, updated_by)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE can_view_contacts = VALUES(can_view_contacts), monthly_limit = VALUES(monthly_limit), access_start = VALUES(access_start), access_end = VALUES(access_end), updated_by = VALUES(updated_by)");
        $stmt->execute([$seller_id, $can_view, $monthly_limit, $start_date, $end_date, $current_user_id]);

        echo json_encode([
            "success" => true,
            "message" => "벤더 정보 열람 권한이 설정되었습니다."
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>