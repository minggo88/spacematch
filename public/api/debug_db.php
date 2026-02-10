<?php
include_once 'db_connect.php';
session_start();

// Security: only superadmin can access debug info
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden"]);
    exit;
}

header('Content-Type: application/json');

$response = [];

// 1. Check Session
$response['session'] = $_SESSION;

// 2. Check Table Structure (Columns)
try {
    $stmt = $conn->query("DESCRIBE applications");
    $response['columns'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
} catch (PDOException $e) {
    $response['columns_error'] = $e->getMessage();
}

// 3. Check All Data (Limit 5)
try {
    $stmt = $conn->query("SELECT * FROM applications ORDER BY created_at DESC LIMIT 5");
    $response['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $response['data_error'] = $e->getMessage();
}

// 4. Check Venue Data (Integrity)
try {
    $stmt = $conn->query("SELECT id, name FROM venues LIMIT 5");
    $response['venues'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $response['venues_error'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>