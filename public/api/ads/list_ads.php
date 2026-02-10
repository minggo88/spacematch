<?php
// Admin: List all ads
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $slot_filter = isset($_GET['slot_id']) ? trim($_GET['slot_id']) : '';

    $sql = "SELECT * FROM ads";
    $params = [];

    if ($slot_filter) {
        $sql .= " WHERE slot_id = :slot_id";
        $params[':slot_id'] = $slot_filter;
    }

    $sql .= " ORDER BY slot_id ASC, priority DESC, created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'ads' => $ads]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>