<?php
/**
 * Public User Profile API
 * Returns non-sensitive profile info for community user profiles
 * Excludes: email, phone, business_no, sensitive personal data
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

include_once '../db_connect.php';
session_start();

$identifier = isset($_GET['id']) ? trim($_GET['id']) : '';
if (empty($identifier)) {
    echo json_encode(["success" => false, "message" => "Invalid user."]);
    exit;
}

// Support both numeric ID and name-based lookup
$is_numeric = ctype_digit($identifier);

try {
    // 1. Build column list dynamically (only PUBLIC fields)
    $base_cols = "id, name, role, status, created_at";

    // Check optional columns
    $optional_cols = ['profile_image', 'category', 'product_category', 'instagram', 'description', 'brand_name', 'email', 'phone'];
    foreach ($optional_cols as $oc) {
        $chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$oc}'");
        if ($chk && $chk->fetch()) {
            $base_cols .= ", {$oc}";
        }
    }

    if ($is_numeric) {
        $stmt = $conn->prepare("SELECT {$base_cols} FROM users WHERE id = ?");
        $stmt->execute([intval($identifier)]);
    } else {
        $stmt = $conn->prepare("SELECT {$base_cols} FROM users WHERE name = ?");
        $stmt->execute([urldecode($identifier)]);
    }
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found."]);
        exit;
    }

    // Mask contact info if vendor is viewing a seller profile (NOT admin)
    $requester_role = $_SESSION['user_role'] ?? '';
    if ($requester_role === 'vendor' && $user['role'] === 'seller') {
        if (isset($user['instagram']))
            $user['instagram'] = '';
        if (isset($user['phone']))
            $user['phone'] = '';
        if (isset($user['email']))
            $user['email'] = '';
    }

    $response = [
        "success" => true,
        "user" => $user,
        "venues" => [],
        "applications" => [],
        "seller_photos" => [],
        "community_stats" => [],
        "stats" => []
    ];

    // 2. Role-based activity data
    if ($user['role'] === 'vendor') {
        // Vendor: show approved venues (public info only)
        $vStmt = $conn->prepare("SELECT id, name, location, type, status, price, images FROM venues WHERE owner_id = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 10");
        $vStmt->execute([$user['id']]);
        $venues = $vStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($venues as &$venue) {
            $images = [];
            if (!empty($venue['images'])) {
                $decoded = json_decode($venue['images'], true);
                if (is_array($decoded))
                    $images = $decoded;
            }
            $venue['images'] = $images;
        }
        $response['venues'] = $venues;
        $response['stats'] = ['total_venues' => count($venues)];

    } else if ($user['role'] === 'seller') {
        // Seller: show approved applications
        try {
            $col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
            $app_col = ($col_check && $col_check->fetch()) ? 'seller_id' : 'user_id';

            $aStmt = $conn->prepare("
                SELECT a.id, a.status, a.created_at, v.name as venue_name, v.location as venue_location, v.type as venue_type
                FROM applications a
                JOIN venues v ON a.venue_id = v.id
                WHERE a.{$app_col} = ? AND a.status = 'approved'
                ORDER BY a.created_at DESC LIMIT 20
            ");
            $aStmt->execute([$user['id']]);
            $applications = $aStmt->fetchAll(PDO::FETCH_ASSOC);
            $response['applications'] = $applications;
            $response['stats'] = ['total_applications' => count($applications)];
        } catch (PDOException $e) {
            // applications table may not exist
            $response['applications'] = [];
            $response['stats'] = ['total_applications' => 0];
        }

        // Seller photos (product showcase)
        try {
            $tblCheck = $conn->query("SHOW TABLES LIKE 'seller_photos'");
            if ($tblCheck && $tblCheck->fetch()) {
                $photoStmt = $conn->prepare("SELECT id, image_url, caption FROM seller_photos WHERE user_id = ? ORDER BY sort_order ASC, created_at ASC LIMIT 10");
                $photoStmt->execute([$user['id']]);
                $response['seller_photos'] = $photoStmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            // seller_photos table may not exist
        }
    }

    // 3. Community activity stats
    try {
        $tblCheck1 = $conn->query("SHOW TABLES LIKE 'community_posts'");
        $tblCheck2 = $conn->query("SHOW TABLES LIKE 'community_comments'");

        $postCount = 0;
        $commentCount = 0;

        if ($tblCheck1 && $tblCheck1->fetch()) {
            $postCountStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE user_id = ?");
            $postCountStmt->execute([$user['id']]);
            $postCount = intval($postCountStmt->fetch(PDO::FETCH_ASSOC)['cnt']);
        }
        if ($tblCheck2 && $tblCheck2->fetch()) {
            $commentCountStmt = $conn->prepare("SELECT COUNT(*) as cnt FROM community_comments WHERE user_id = ?");
            $commentCountStmt->execute([$user['id']]);
            $commentCount = intval($commentCountStmt->fetch(PDO::FETCH_ASSOC)['cnt']);
        }

        $response['community_stats'] = [
            'post_count' => $postCount,
            'comment_count' => $commentCount
        ];
    } catch (PDOException $e) {
        $response['community_stats'] = ['post_count' => 0, 'comment_count' => 0];
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>