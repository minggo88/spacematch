<?php
require_once '../db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid User ID"]);
    exit;
}

try {
    // 1. Get Basic User Info
    $stmt = $conn->prepare("SELECT id, name, email, role, status, phone, business_no, created_at, venue_limit FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit;
    }

    $response = [
        "success" => true,
        "user" => $user,
        "venues" => [],
        "applications" => [],
        "stats" => []
    ];

    // 2. Get Activities based on Role
    if ($user['role'] === 'host') {
        // Get Venues
        $vStmt = $conn->prepare("SELECT * FROM venues WHERE owner_id = ? ORDER BY created_at DESC");
        $vStmt->execute([$id]);
        $venues = $vStmt->fetchAll(PDO::FETCH_ASSOC);

        // Process Images
        foreach ($venues as &$venue) {
            $images = [];
            if (!empty($venue['images'])) {
                $decoded = json_decode($venue['images'], true);
                if (is_array($decoded)) {
                    $images = $decoded;
                }
            }
            $venue['images'] = $images;
        }
        $response['venues'] = $venues;

        // Stats
        $response['stats'] = [
            'total_venues' => count($venues),
            'approved_venues' => count(array_filter($venues, function ($v) {
                return $v['status'] === 'approved';
            })),
            'pending_venues' => count(array_filter($venues, function ($v) {
                return $v['status'] === 'pending';
            }))
        ];

    } else if ($user['role'] === 'seller') {
        // Detect whether applications table uses 'seller_id' or 'user_id'
        $col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
        $app_col = $col_check->fetch() ? 'seller_id' : 'user_id';

        // Get Applications
        $aStmt = $conn->prepare("
            SELECT a.*, v.name as venue_name, v.location as venue_location 
            FROM applications a 
            JOIN venues v ON a.venue_id = v.id 
            WHERE a.{$app_col} = ? 
            ORDER BY a.created_at DESC
        ");
        $aStmt->execute([$id]);
        $applications = $aStmt->fetchAll(PDO::FETCH_ASSOC);
        $response['applications'] = $applications;

        // Stats
        $response['stats'] = [
            'total_applications' => count($applications),
            'approved_applications' => count(array_filter($applications, function ($a) {
                return $a['status'] === 'approved';
            })),
            'pending_applications' => count(array_filter($applications, function ($a) {
                return $a['status'] === 'pending';
            }))
        ];
    } else if ($user['role'] === 'admin' || $user['role'] === 'superadmin') {
        // Admin stats? Maybe logs later.
        $response['stats'] = ['info' => 'Admin account'];
    }

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>