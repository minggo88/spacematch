<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Any logged-in user can browse sellers (vendors primarily)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["error" => "로그인이 필요합니다."]);
    exit;
}

try {
    // Ensure featured/verified columns exist
    $auto_cols = [
        'is_featured' => 'TINYINT(1) DEFAULT 0',
        'featured_start' => 'DATE DEFAULT NULL',
        'featured_end' => 'DATE DEFAULT NULL',
        'is_verified' => 'TINYINT(1) DEFAULT 0',
        'verified_start' => 'DATE DEFAULT NULL',
        'verified_end' => 'DATE DEFAULT NULL'
    ];
    foreach ($auto_cols as $col => $def) {
        try {
            $conn->exec("ALTER TABLE users ADD COLUMN {$col} {$def}");
        } catch (PDOException $e) {
        }
    }

    // Check if optional columns exist
    $cols = "u.id, u.name, u.email, u.phone, u.business_no, u.profile_image, u.is_featured, u.featured_start, u.featured_end, u.is_verified, u.verified_start, u.verified_end, u.created_at";

    $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'category'");
    $has_category = $col_check->fetch() ? true : false;
    if ($has_category)
        $cols .= ", u.category";

    $col_check2 = $conn->query("SHOW COLUMNS FROM users LIKE 'instagram'");
    $has_instagram = $col_check2->fetch() ? true : false;
    if ($has_instagram)
        $cols .= ", u.instagram";

    $col_check3 = $conn->query("SHOW COLUMNS FROM users LIKE 'description'");
    $has_description = $col_check3->fetch() ? true : false;
    if ($has_description)
        $cols .= ", u.description";

    // Check is_public column
    $col_check_public = $conn->query("SHOW COLUMNS FROM users LIKE 'is_public'");
    $has_is_public = $col_check_public->fetch() ? true : false;

    // Check if applications table uses seller_id or user_id
    $app_col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
    $app_col = $app_col_check->fetch() ? 'seller_id' : 'user_id';

    $visibility_filter = $has_is_public ? "AND (u.is_public = 1 OR u.is_public IS NULL)" : "";

    $today = date('Y-m-d');
    $query = "SELECT {$cols},
                (SELECT COUNT(*) FROM applications a WHERE a.{$app_col} = u.id) as app_count
              FROM users u 
              WHERE u.role = 'seller' AND u.status = 'active' {$visibility_filter}
              ORDER BY (CASE WHEN u.is_featured = 1 AND (u.featured_start IS NULL OR u.featured_start <= '{$today}') AND (u.featured_end IS NULL OR u.featured_end >= '{$today}') THEN 1 ELSE 0 END) DESC, u.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if seller_photos table exists
    $has_photos_table = false;
    try {
        $conn->query("SELECT 1 FROM seller_photos LIMIT 1");
        $has_photos_table = true;
    } catch (PDOException $e) {
        // Table doesn't exist yet
    }

    $today = date('Y-m-d');
    foreach ($sellers as &$seller) {
        $seller['app_count'] = intval($seller['app_count']);

        // Apply period-based checks: only show as featured/verified if within active period
        $raw_featured = intval($seller['is_featured'] ?? 0);
        $raw_verified = intval($seller['is_verified'] ?? 0);

        $featured_active = $raw_featured &&
            (!$seller['featured_start'] || $seller['featured_start'] <= $today) &&
            (!$seller['featured_end'] || $seller['featured_end'] >= $today);
        $verified_active = $raw_verified &&
            (!$seller['verified_start'] || $seller['verified_start'] <= $today) &&
            (!$seller['verified_end'] || $seller['verified_end'] >= $today);

        $seller['is_featured'] = $featured_active ? 1 : 0;
        $seller['is_verified'] = $verified_active ? 1 : 0;
        if (!isset($seller['category']))
            $seller['category'] = '';
        if (!isset($seller['instagram']))
            $seller['instagram'] = '';
        if (!isset($seller['description']))
            $seller['description'] = '';
        if (!isset($seller['profile_image']))
            $seller['profile_image'] = '';

        // Attach seller photos
        $seller['photos'] = [];
        if ($has_photos_table) {
            $photoStmt = $conn->prepare("SELECT id, image_url, caption FROM seller_photos WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC LIMIT 10");
            $photoStmt->execute([$seller['id']]);
            $photos = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
            // Fix relative paths
            foreach ($photos as &$photo) {
                if (!empty($photo['image_url']) && strpos($photo['image_url'], 'uploads/') === 0) {
                    $photo['image_url'] = '/' . $photo['image_url'];
                }
            }
            $seller['photos'] = $photos;
        }
    }

    // Mask contact info for vendor users
    $requester_role = $_SESSION['user_role'] ?? '';
    if ($requester_role === 'vendor') {
        foreach ($sellers as &$s) {
            $s['email'] = '';
            $s['phone'] = '';
            $s['instagram'] = '';
        }
    }

    echo json_encode($sellers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error: " . $e->getMessage()]);
}
?>