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
    // Ensure is_featured column exists
    try {
        $conn->exec("ALTER TABLE users ADD COLUMN is_featured TINYINT(1) DEFAULT 0");
    } catch (PDOException $e) { /* column already exists */
    }

    // Check if optional columns exist
    $cols = "u.id, u.name, u.email, u.phone, u.business_no, u.profile_image, u.is_featured, u.created_at";

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

    // Check if applications table uses seller_id or user_id
    $app_col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
    $app_col = $app_col_check->fetch() ? 'seller_id' : 'user_id';

    $query = "SELECT {$cols},
                (SELECT COUNT(*) FROM applications a WHERE a.{$app_col} = u.id) as app_count
              FROM users u 
              WHERE u.role = 'seller' AND u.status = 'active'
              ORDER BY u.is_featured DESC, u.created_at DESC";

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

    foreach ($sellers as &$seller) {
        $seller['app_count'] = intval($seller['app_count']);
        $seller['is_featured'] = intval($seller['is_featured'] ?? 0);
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
            $photoStmt = $conn->prepare("SELECT id, image_url, caption FROM seller_photos WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC LIMIT 5");
            $photoStmt->execute([$seller['id']]);
            $seller['photos'] = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    echo json_encode($sellers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error: " . $e->getMessage()]);
}
?>