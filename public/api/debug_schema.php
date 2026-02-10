<?php
include_once '../db_connect.php';
session_start();

// Security: only superadmin can access debug info
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden"]);
    exit;
}

try {
    $stmt = $conn->query("DESCRIBE venues");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($columns);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>