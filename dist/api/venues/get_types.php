<?php
include_once '../db_connect.php';
header('Content-Type: application/json');

try {
    // Fetch only active types
    $stmt = $conn->prepare("SELECT name, code FROM venue_types WHERE is_active = 1 ORDER BY id ASC");
    $stmt->execute();
    $types = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($types);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>