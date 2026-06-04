<?php
include_once '../db_connect.php';
session_start();

// Check if vendor or admin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['host', 'admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'];

if ($role === 'host') {
    // Vendors see only their own venues
    $query = "SELECT v.*, 
              (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count
              FROM venues v WHERE v.owner_id = ? ORDER BY v.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $user_id);
} else {
    // Admins see all venues
    $query = "SELECT v.*, 
              (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count
              FROM venues v ORDER BY v.created_at DESC";
    $stmt = $conn->prepare($query);
}

$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Parse images JSON
foreach ($results as &$venue) {
    if (isset($venue['images'])) {
        $venue['images'] = json_decode($venue['images'], true);
    }
    foreach (['name', 'description', 'location', 'type', 'size', 'region', 'avg_sales'] as $field) {
        if (isset($venue[$field])) $venue[$field] = deep_decode($venue[$field]);
    }
}

echo json_encode($results);
?>