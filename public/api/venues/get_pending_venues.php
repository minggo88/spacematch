<?php
include_once '../db_connect.php';
session_start();

// Allow only admin or superadmin
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(array("success" => false, "message" => "Unauthorized access."));
    exit;
}

try {
    // Fetch all pending venues with owner info
    $query = "SELECT v.*, u.name as owner_name, u.email as owner_email 
              FROM venues v 
              JOIN users u ON v.owner_id = u.id 
              WHERE v.status = 'pending' 
              ORDER BY v.created_at ASC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    function deep_decode($str) {
        if (!is_string($str)) return $str;
        $prev = null;
        while ($prev !== $str) {
            $prev = $str;
            $str = html_entity_decode($str, ENT_QUOTES, 'UTF-8');
        }
        return $str;
    }

    // Decode images
    foreach ($results as &$venue) {
        if ($venue['images']) {
            $venue['images'] = json_decode($venue['images']);
        } else {
            $venue['images'] = [];
        }
        foreach (['name', 'description', 'location', 'type', 'size', 'region', 'avg_sales'] as $field) {
            if (isset($venue[$field])) $venue[$field] = deep_decode($venue[$field]);
        }
    }

    echo json_encode($results);

} catch (PDOException $e) {
    echo json_encode(array("success" => false, "message" => "DB Error: " . $e->getMessage()));
}
?>