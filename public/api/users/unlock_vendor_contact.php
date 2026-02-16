<?php
/**
 * Unlock Vendor Contact Info API (for sellers)
 * Mirror of unlock_seller_contact.php
 * 
 * POST: Seller requests to view a specific vendor's contact info
 * Body: { vendor_id: int }
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

$seller_id = $_SESSION['user_id'];
$seller_role = $_SESSION['user_role'] ?? '';
$is_admin = in_array($seller_role, ['admin', 'superadmin']);

$input = json_decode(file_get_contents('php://input'), true);
$vendor_id = intval($input['vendor_id'] ?? 0);

if ($vendor_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid vendor ID."]);
    exit;
}

try {
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
            INDEX idx_seller_month (seller_id, viewed_at)
        )");
    } catch (PDOException $e) { /* tables exist */
    }

    // Get vendor info
    $cols = "id, name, email, phone";
    $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
    if ($col_check && $col_check->fetch()) {
        $cols .= ", instagram";
    }
    $bn_check = $conn->query("SHOW COLUMNS FROM users LIKE 'business_no'");
    if ($bn_check && $bn_check->fetch()) {
        $cols .= ", business_no";
    }

    $vendorStmt = $conn->prepare("SELECT {$cols} FROM users WHERE id = ? AND role = 'vendor'");
    $vendorStmt->execute([$vendor_id]);
    $vendor = $vendorStmt->fetch(PDO::FETCH_ASSOC);

    if (!$vendor) {
        echo json_encode(["success" => false, "message" => "Vendor not found."]);
        exit;
    }

    // Admin bypass
    if ($is_admin) {
        echo json_encode([
            "success" => true,
            "contact" => [
                "name" => $vendor['name'] ?? '',
                "email" => $vendor['email'] ?? '',
                "phone" => $vendor['phone'] ?? '',
                "instagram" => $vendor['instagram'] ?? '',
                "business_no" => $vendor['business_no'] ?? ''
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check seller permission
    $accessStmt = $conn->prepare("SELECT can_view_contacts, monthly_limit, access_start, access_end FROM seller_vendor_access WHERE seller_id = ?");
    $accessStmt->execute([$seller_id]);
    $access = $accessStmt->fetch(PDO::FETCH_ASSOC);

    if (!$access || !intval($access['can_view_contacts'])) {
        echo json_encode([
            "success" => false,
            "message" => "No permission to view vendor contacts. Please contact admin.",
            "error_code" => "NO_PERMISSION"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check access period
    $today = date('Y-m-d');
    $access_start = $access['access_start'] ?? null;
    $access_end = $access['access_end'] ?? null;

    if ($access_start && $today < $access_start) {
        echo json_encode(["success" => false, "message" => "Access period has not started yet.", "error_code" => "NOT_STARTED"], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($access_end && $today > $access_end) {
        echo json_encode(["success" => false, "message" => "Access period has expired.", "error_code" => "EXPIRED"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $monthly_limit = intval($access['monthly_limit']);

    // Count views
    if ($access_start && $access_end) {
        $alreadyStmt = $conn->prepare("SELECT id FROM vendor_contact_views WHERE seller_id = ? AND vendor_id = ? AND viewed_at >= ? AND viewed_at <= ?");
        $alreadyStmt->execute([$seller_id, $vendor_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
        $already_viewed = $alreadyStmt->fetch();
        $usedStmt = $conn->prepare("SELECT COUNT(DISTINCT vendor_id) as used FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ? AND viewed_at <= ?");
        $usedStmt->execute([$seller_id, $access_start . ' 00:00:00', $access_end . ' 23:59:59']);
    } else {
        $month_start = date('Y-m-01 00:00:00');
        $alreadyStmt = $conn->prepare("SELECT id FROM vendor_contact_views WHERE seller_id = ? AND vendor_id = ? AND viewed_at >= ?");
        $alreadyStmt->execute([$seller_id, $vendor_id, $month_start]);
        $already_viewed = $alreadyStmt->fetch();
        $usedStmt = $conn->prepare("SELECT COUNT(DISTINCT vendor_id) as used FROM vendor_contact_views WHERE seller_id = ? AND viewed_at >= ?");
        $usedStmt->execute([$seller_id, $month_start]);
    }
    $used = intval($usedStmt->fetch(PDO::FETCH_ASSOC)['used']);

    $contact = [
        "name" => $vendor['name'] ?? '',
        "email" => $vendor['email'] ?? '',
        "phone" => $vendor['phone'] ?? '',
        "instagram" => $vendor['instagram'] ?? '',
        "business_no" => $vendor['business_no'] ?? ''
    ];

    if ($already_viewed) {
        echo json_encode(["success" => true, "already_viewed" => true, "contact" => $contact], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Check quota
    if ($used >= $monthly_limit) {
        echo json_encode([
            "success" => false,
            "message" => "View quota exhausted. ({$used}/{$monthly_limit})",
            "error_code" => "QUOTA_EXCEEDED"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Record the view
    $insertStmt = $conn->prepare("INSERT INTO vendor_contact_views (seller_id, vendor_id) VALUES (?, ?)");
    $insertStmt->execute([$seller_id, $vendor_id]);

    echo json_encode([
        "success" => true,
        "already_viewed" => false,
        "used" => $used + 1,
        "limit" => $monthly_limit,
        "remaining" => $monthly_limit - $used - 1,
        "contact" => $contact
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>