<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$role = $_SESSION['user_role'];
$user_id = $_SESSION['user_id'];

// Auto-migrate: add is_priority column (once per session)
if (empty($_SESSION['_ddl_applications'])) {
    try {
        $conn->exec("ALTER TABLE applications ADD COLUMN is_priority TINYINT(1) DEFAULT 0");
    } catch (Exception $e) { /* column likely exists */
    }
    $_SESSION['_ddl_applications'] = true;
}

if ($role === 'admin' || $role === 'superadmin') {
    // Admin sees all
    $query = "SELECT a.*, v.name as venue_name, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone, u.category as sellerCategory, u.instagram, u.description 
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              JOIN users u ON a.user_id = u.id 
              ORDER BY a.is_priority DESC, a.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
} elseif ($role === 'host') {
    // Vendor sees applications for THEIR venues
    $query = "SELECT a.*, v.name as venue_name, v.images as venue_images, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone, u.category as applicant_category, u.instagram as applicant_instagram, u.description as applicant_description, u.brand_name as applicant_brand, u.keywords as applicant_keywords, u.created_at as applicant_joined_at, u.is_verified
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              JOIN users u ON a.user_id = u.id 
              WHERE v.owner_id = ? 
              ORDER BY a.is_priority DESC, a.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();
} else {
    // Seller sees applications they MADE
    $query = "SELECT a.*, v.name as venue_name, v.location as venue_location, v.price as venue_price, v.images as venue_images 
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              WHERE a.user_id = ? 
              ORDER BY a.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();
}

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Decode images JSON
foreach ($results as &$row) {
    if (isset($row['venue_images'])) {
        $row['venue_images'] = json_decode($row['venue_images']);
    }
    if (isset($row['applicant_keywords'])) {
        $decoded = json_decode($row['applicant_keywords']);
        $row['applicant_keywords'] = is_array($decoded) ? $decoded : [];
    }
    if (isset($row['selected_period'])) {
        $row['selected_period'] = json_decode($row['selected_period']);
    }
    if (isset($row['attachments'])) {
        $decoded = json_decode($row['attachments']);
        $row['attachments'] = is_array($decoded) ? $decoded : [];
    }
}

echo json_encode($results);
?>