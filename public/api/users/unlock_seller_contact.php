<?php
/**
 * Unlock Seller Contact Info API
 * 
 * POST: Vendor requests to view a specific seller's contact info
 * Body: { seller_id: int }
 * 
 * Returns: seller's email, phone, instagram if authorized
 * - Checks vendor has can_view_contacts permission
 * - Checks access period hasn't expired
 * - Checks view quota hasn't been exceeded
 * - If seller was already viewed in this period, no quota deduction
 */
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$host_id = $_SESSION['user_id'];
$vendor_role = $_SESSION['user_role'] ?? '';

// Admins can always view
$is_admin = in_array($vendor_role, ['admin', 'superadmin']);

$input = json_decode(file_get_contents('php://input'), true);
$seller_id = intval($input['seller_id'] ?? 0);

if ($seller_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid seller ID."]);
    exit;
}

try {
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
        $conn->exec("CREATE TABLE IF NOT EXISTS seller_contact_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            host_id INT NOT NULL,
            seller_id INT NOT NULL,
            viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_vendor_month (host_id, viewed_at)
        )");

        // Auto-migrate: handle legacy column names and old unique constraints
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
        // Auto-migrate period columns
        try {
            $conn->exec("ALTER TABLE vendor_seller_access ADD COLUMN access_start DATE DEFAULT NULL AFTER monthly_limit");
        } catch (PDOException $e) {
        }
        try {
            $conn->exec("ALTER TABLE vendor_seller_access ADD COLUMN access_end DATE DEFAULT NULL AFTER access_start");
        } catch (PDOException $e) {
        }
    } catch (PDOException $e) { /* tables exist */
    }

    // Get seller info
    $cols = "id, email, phone";
    $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
    if ($col_check && $col_check->fetch()) {
        $cols .= ", instagram";
    }
    $bn_check = $conn->query("SHOW COLUMNS FROM users LIKE 'business_no'");
    if ($bn_check && $bn_check->fetch()) {
        $cols .= ", business_no";
    }

    $sellerStmt = $conn->prepare("SELECT {$cols} FROM users WHERE id = ? AND role = 'seller'");
    $sellerStmt->execute([$seller_id]);
    $seller = $sellerStmt->fetch(PDO::FETCH_ASSOC);

    if (!$seller) {
        echo json_encode(["success" => false, "message" => "Seller not found."]);
        exit;
    }

    // Admins bypass all checks
    if ($is_admin) {
        echo json_encode([
            "success" => true,
            "contact" => [
                "email" => $seller['email'] ?? '',
                "phone" => $seller['phone'] ?? '',
                "instagram" => $seller['instagram'] ?? '',
                "business_no" => $seller['business_no'] ?? ''
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check vendor permission
    $accessStmt = $conn->prepare("SELECT can_view_contacts, monthly_limit, access_start, access_end FROM vendor_seller_access WHERE host_id = ?");
    $accessStmt->execute([$host_id]);
    $access = $accessStmt->fetch(PDO::FETCH_ASSOC);

    if (!$access || !intval($access['can_view_contacts'])) {
        echo json_encode([
            "success" => false,
            "message" => "No permission to view seller contacts. Please contact admin.",
            "error_code" => "NO_PERMISSION"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check access period
    $today = date('Y-m-d');
    $access_start = $access['access_start'] ?? null;
    $access_end = $access['access_end'] ?? null;

    if ($access_start && $today < $access_start) {
        echo json_encode([
            "success" => false,
            "message" => "Access period has not started yet. (Start: {$access_start})",
            "error_code" => "NOT_STARTED"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($access_end && $today > $access_end) {
        echo json_encode([
            "success" => false,
            "message" => "Access period has expired. (End: {$access_end})",
            "error_code" => "EXPIRED"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $monthly_limit = intval($access['monthly_limit']);

    // Count views within the access period (or this month if no period set)
    if ($access_start && $access_end) {
        // Check within the configured period
        $alreadyStmt = $conn->prepare("SELECT id FROM seller_contact_views WHERE host_id = ? AND seller_id = ? AND viewed_at >= ? AND viewed_at <= ?");
        $alreadyStmt->execute([$host_id, $seller_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        $already_viewed = $alreadyStmt->fetch();

        $usedStmt = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as used FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ? AND viewed_at <= ?");
        $usedStmt->execute([$host_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
    } else {
        // Legacy: count within current month
        $month_start = date('Y-m-01 00:00:00');
        $alreadyStmt = $conn->prepare("SELECT id FROM seller_contact_views WHERE host_id = ? AND seller_id = ? AND viewed_at >= ?");
        $alreadyStmt->execute([$host_id, $seller_id, $month_start]);
        $already_viewed = $alreadyStmt->fetch();

        $usedStmt = $conn->prepare("SELECT COUNT(DISTINCT seller_id) as used FROM seller_contact_views WHERE host_id = ? AND viewed_at >= ?");
        $usedStmt->execute([$host_id, $month_start]);
    }
    $used = intval($usedStmt->fetch(PDO::FETCH_ASSOC)['used']);

    if ($already_viewed) {
        // Already viewed - return contact without deducting
        echo json_encode([
            "success" => true,
            "already_viewed" => true,
            "contact" => [
                "email" => $seller['email'] ?? '',
                "phone" => $seller['phone'] ?? '',
                "instagram" => $seller['instagram'] ?? '',
                "business_no" => $seller['business_no'] ?? ''
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check quota
    if ($used >= $monthly_limit) {
        $period_label = ($access_start && $access_end) ? "Configured period" : "This month";
        echo json_encode([
            "success" => false,
            "message" => "{$period_label} view quota exhausted. ({$used}/{$monthly_limit})",
            "error_code" => "QUOTA_EXCEEDED",
            "used" => $used,
            "limit" => $monthly_limit
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Record the view
    $insertStmt = $conn->prepare("INSERT INTO seller_contact_views (host_id, seller_id) VALUES (?, ?)");
    $insertStmt->execute([$host_id, $seller_id]);

    echo json_encode([
        "success" => true,
        "already_viewed" => false,
        "used" => $used + 1,
        "limit" => $monthly_limit,
        "remaining" => $monthly_limit - $used - 1,
        "contact" => [
            "email" => $seller['email'] ?? '',
            "phone" => $seller['phone'] ?? '',
            "instagram" => $seller['instagram'] ?? '',
            "business_no" => $seller['business_no'] ?? ''
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>