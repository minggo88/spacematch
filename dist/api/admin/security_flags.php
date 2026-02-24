<?php
// Public API: Get specific security flags needed by frontend
// This endpoint does NOT require authentication — 
// it only returns non-sensitive boolean flags
include_once '../db_connect.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit();
}

// Only expose these non-sensitive flags
$public_keys = ['disable_devtools_block'];

try {
    $placeholders = implode(',', array_fill(0, count($public_keys), '?'));
    $stmt = $conn->prepare("SELECT setting_key, setting_value FROM security_settings WHERE setting_key IN ($placeholders)");
    $stmt->execute($public_keys);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $flags = [];
    foreach ($public_keys as $key) {
        $flags[$key] = '0'; // default
    }
    foreach ($rows as $row) {
        $flags[$row['setting_key']] = $row['setting_value'];
    }

    echo json_encode(['success' => true, 'flags' => $flags]);
} catch (Exception $e) {
    // If table doesn't exist yet, return defaults
    $flags = [];
    foreach ($public_keys as $key) {
        $flags[$key] = '0';
    }
    echo json_encode(['success' => true, 'flags' => $flags]);
}
?>