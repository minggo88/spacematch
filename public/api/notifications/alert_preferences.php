<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Ensure table exists
$conn->exec("CREATE TABLE IF NOT EXISTS alert_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    regions JSON DEFAULT NULL,
    types JSON DEFAULT NULL,
    min_price INT DEFAULT 0,
    max_price INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get current preferences
    $stmt = $conn->prepare("SELECT * FROM alert_preferences WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $pref = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($pref) {
        $pref['regions'] = json_decode($pref['regions'] ?: '[]');
        $pref['types'] = json_decode($pref['types'] ?: '[]');
        echo json_encode(['success' => true, 'preferences' => $pref]);
    } else {
        echo json_encode(['success' => true, 'preferences' => null]);
    }

} elseif ($method === 'POST') {
    // Save/update preferences
    $data = json_decode(file_get_contents("php://input"), true);

    $regions = isset($data['regions']) ? json_encode($data['regions']) : '[]';
    $types = isset($data['types']) ? json_encode($data['types']) : '[]';
    $min_price = isset($data['min_price']) ? intval($data['min_price']) : 0;
    $max_price = isset($data['max_price']) ? intval($data['max_price']) : 0;
    $is_active = isset($data['is_active']) ? intval($data['is_active']) : 1;

    $stmt = $conn->prepare("INSERT INTO alert_preferences (user_id, regions, types, min_price, max_price, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE regions = VALUES(regions), types = VALUES(types), 
        min_price = VALUES(min_price), max_price = VALUES(max_price), is_active = VALUES(is_active)");

    if ($stmt->execute([$user_id, $regions, $types, $min_price, $max_price, $is_active])) {
        echo json_encode(['success' => true, 'message' => '알림 설정이 저장되었습니다.']);
    } else {
        echo json_encode(['success' => false, 'message' => '저장 실패']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid method']);
}
?>