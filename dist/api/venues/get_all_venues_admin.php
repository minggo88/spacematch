<?php
include_once '../db_connect.php';
include_once '../utils/session_role.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

$role = sm_sync_session_role($conn);
$roleNorm = sm_normalize_role($role);
if (!sm_is_admin_role($roleNorm)) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

try {
    // Fetch ALL venues (pending, approved, rejected, suspended) with owner info
    $query = "SELECT v.*, u.name as owner_name, u.email as owner_email 
              FROM venues v 
              LEFT JOIN users u ON v.owner_id = u.id 
              ORDER BY v.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode images
    foreach ($results as &$venue) {
        if ($venue['images']) {
            $venue['images'] = json_decode($venue['images']);
        } else {
            $venue['images'] = [];
        }
    }

    echo json_encode($results);

} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
}
?>