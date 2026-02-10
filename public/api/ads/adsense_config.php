<?php
// Admin: Get/Update AdSense config
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get config
    try {
        $stmt = $conn->query("SELECT * FROM adsense_config LIMIT 1");
        $config = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($config && $config['slot_configs']) {
            $config['slot_configs'] = json_decode($config['slot_configs'], true);
        }
        echo json_encode(['success' => true, 'config' => $config ?: ['client_id' => '', 'slot_configs' => new \stdClass(), 'is_enabled' => 0]]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update config
    $data = json_decode(file_get_contents('php://input'), true);
    $client_id = isset($data['client_id']) ? trim($data['client_id']) : '';
    $slot_configs = isset($data['slot_configs']) ? $data['slot_configs'] : new \stdClass();
    $is_enabled = isset($data['is_enabled']) ? intval($data['is_enabled']) : 0;

    try {
        $check = $conn->query("SELECT COUNT(*) FROM adsense_config");
        if ($check->fetchColumn() == 0) {
            $stmt = $conn->prepare("INSERT INTO adsense_config (client_id, slot_configs, is_enabled) VALUES (:client_id, :slot_configs, :is_enabled)");
        } else {
            $stmt = $conn->prepare("UPDATE adsense_config SET client_id = :client_id, slot_configs = :slot_configs, is_enabled = :is_enabled WHERE id = (SELECT MIN(sub.id) FROM (SELECT id FROM adsense_config) sub)");
        }
        $stmt->execute([
            ':client_id' => $client_id,
            ':slot_configs' => json_encode($slot_configs),
            ':is_enabled' => $is_enabled
        ]);
        echo json_encode(['success' => true, 'message' => 'AdSense 설정이 저장되었습니다.']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>