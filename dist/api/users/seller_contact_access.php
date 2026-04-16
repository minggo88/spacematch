<?php
/**
 * Seller Contact Access Management API
 * 
 * GET: Check vendor's current access permission & remaining views
 *   - Query param: host_id (optional, admin can check any vendor)
 * 
 * POST (admin only): Set vendor's contact viewing permission, period, and limit
 *   - Body: { host_id, can_view_contacts (0/1), monthly_limit (int), start_date, end_date }
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
    $conn->exec("CREATE TABLE IF NOT EXISTS vendor_seller_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        host_id INT NOT NULL UNIQUE,
        can_view_contacts TINYINT(1) DEFAULT 0,
        monthly_limit INT DEFAULT 0,
        access_start DATE DEFAULT NULL,
        access_end DATE DEFAULT NULL,
        updated_by INT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_host_id (host_id)
    )");

    // Auto-migrate: add period columns if missing
    try {
        $conn->exec("ALTER TABLE vendor_seller_access ADD COLUMN access_start DATE DEFAULT NULL AFTER monthly_limit");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE vendor_seller_access ADD COLUMN access_end DATE DEFAULT NULL AFTER access_start");
    } catch (PDOException $e) {
    }

    // Auto-migrate: handle potential legacy column names for host_id to fix "Unknown column 'host_id'" DB Error
    try {
        $conn->exec("ALTER TABLE vendor_seller_access CHANGE COLUMN vendor_id host_id INT NOT NULL UNIQUE");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE vendor_seller_access CHANGE COLUMN user_id host_id INT NOT NULL UNIQUE");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE seller_contact_views CHANGE COLUMN vendor_id host_id INT NOT NULL");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE seller_contact_views CHANGE COLUMN user_id host_id INT NOT NULL");
    } catch (PDOException $e) {
    }

    // Drop old unique constraints that prevent monthly re-views
    try {
        $conn->exec("ALTER TABLE seller_contact_views DROP INDEX vendor_id");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE seller_contact_views DROP INDEX uk_vendor_seller");
    } catch (PDOException $e) {
    }
    try {
        $conn->exec("ALTER TABLE seller_contact_views DROP INDEX uk_host_seller");
    } catch (PDOException $e) {
    }

    $conn->exec("CREATE TABLE IF NOT EXISTS seller_contact_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        host_id INT NOT NULL,
        seller_id INT NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_vendor_month (host_id, viewed_at),
        UNIQUE KEY uk_vendor_seller_month (host_id, seller_id, viewed_at)
    )");
} catch (PDOException $e) {
    // Tables might already exist
}

// GET: Check access status
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $host_id = isset($_GET['host_id']) ? intval($_GET['host_id']) : $current_user_id;

    // Only admins can check other hosts
    if ($host_id !== $current_user_id && !in_array($current_role, ['admin', 'superadmin'])) {
        $host_id = $current_user_id;
    }

    try {
        // Get access settings
        $stmt = $conn->prepare("SELECT can_view_contacts, monthly_limit, access_start, access_end FROM vendor_seller_access WHERE host_id = ?");
        $stmt->execute([$host_id]);
        $access = $stmt->fetch(PDO::FETCH_ASSOC);

        $can_view = $access ? intval($access['can_view_contacts']) : 0;
        $monthly_limit = $access ? intval($access['monthly_limit']) : 0;
        $access_start = $access ? ($access['access_start'] ?? null) : null;
        $access_end = $access ? ($access['access_end'] ?? null) : null;

        // Check if period has expired
        $today = date('Y-m-d');
        $is_expired = false;
        if ($can_view && $access_end && $today > $access_end) {
            $is_expired = true;
        }
        $is_not_started = false;
        if ($can_view && $access_start && $today < $access_start) {
            $is_not_started = true;
        }

        // Count views within the access period (or this month if no period set)
        if ($access_start && $access_end) {
            $viewStmt = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as used FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ? AND viewed_at <= ?");
            $viewStmt->execute([$host_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        } else {
            $month_start = date('Y-m-01 00:00:00');
            $viewStmt = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as used FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ?");
            $viewStmt->execute([$host_id, $month_start]);
        }
        $used = intval($viewStmt->fetch(PDO::FETCH_ASSOC)['used']);

        // Get list of already-viewed seller IDs
        if ($access_start && $access_end) {
            $viewedStmt = $conn->prepare("SELECT DISTINCT seller_id FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ? AND viewed_at <= ?");
            $viewedStmt->execute([$host_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        } else {
            $month_start = date('Y-m-01 00:00:00');
            $viewedStmt = $conn->prepare("SELECT DISTINCT seller_id FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ?");
            $viewedStmt->execute([$host_id, $month_start]);
        }
        $viewed_sellers = $viewedStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "success" => true,
            "can_view_contacts" => $can_view,
            "monthly_limit" => $monthly_limit,
            "access_start" => $access_start,
            "access_end" => $access_end,
            "is_expired" => $is_expired,
            "is_not_started" => $is_not_started,
            "used_this_period" => $used,
            "used_this_month" => $used,
            "remaining" => max(0, $monthly_limit - $used),
            "viewed_seller_ids" => array_map('intval', $viewed_sellers)
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

// POST: Admin sets vendor access permissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!in_array($current_role, ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "관리자 권한이 필요합니다."]);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $host_id = intval($input['host_id'] ?? 0);
    $can_view = intval($input['can_view_contacts'] ?? 0);
    $monthly_limit = intval($input['monthly_limit'] ?? 0);
    $start_date = isset($input['start_date']) && $input['start_date'] ? $input['start_date'] : null;
    $end_date = isset($input['end_date']) && $input['end_date'] ? $input['end_date'] : null;

    if ($host_id <= 0) {
        echo json_encode(["success" => false, "message" => "유효하지 않은 호스트 ID입니다."]);
        exit;
    }

    // If disabling, clear dates
    if (!$can_view) {
        $start_date = null;
        $end_date = null;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO vendor_seller_access (host_id, can_view_contacts, monthly_limit, access_start, access_end, updated_by)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE can_view_contacts = VALUES(can_view_contacts), monthly_limit = VALUES(monthly_limit), access_start = VALUES(access_start), access_end = VALUES(access_end), updated_by = VALUES(updated_by)");
        $stmt->execute([$host_id, $can_view, $monthly_limit, $start_date, $end_date, $current_user_id]);

        $msg = "셀러 정보 열람 권한이 설정되었습니다.";
        if ($can_view && $start_date && $end_date) {
            $msg .= " ({$start_date} ~ {$end_date}, 최대 {$monthly_limit}회)";
        }

        echo json_encode([
            "success" => true,
            "message" => $msg,
            "can_view_contacts" => $can_view,
            "monthly_limit" => $monthly_limit,
            "access_start" => $start_date,
            "access_end" => $end_date
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>