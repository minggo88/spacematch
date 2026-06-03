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

    // 2. Get Venues (host 역할)
    if ($user['role'] === 'host') {
        $vStmt = $conn->prepare("SELECT * FROM venues WHERE owner_id = ? ORDER BY created_at DESC");
        $vStmt->execute([$id]);
        $venues = $vStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($venues as &$venue) {
            $decoded = !empty($venue['images']) ? json_decode($venue['images'], true) : [];
            $venue['images'] = is_array($decoded) ? $decoded : [];
        }
        $response['venues'] = $venues;
        $response['stats'] = [
            'total_venues'    => count($venues),
            'approved_venues' => count(array_filter($venues, fn($v) => $v['status'] === 'approved')),
            'pending_venues'  => count(array_filter($venues, fn($v) => $v['status'] === 'pending')),
        ];
    }

    // 3. Get Applications (역할 무관하게 항상 조회)
    $col_check = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
    $app_col = $col_check->fetch() ? 'seller_id' : 'user_id';

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

    if (empty($response['stats'])) {
        $response['stats'] = [
            'total_applications'    => count($applications),
            'approved_applications' => count(array_filter($applications, fn($a) => $a['status'] === 'approved')),
            'pending_applications'  => count(array_filter($applications, fn($a) => $a['status'] === 'pending')),
        ];
    }

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>