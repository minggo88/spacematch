<?php
// Admin: Create or get share token for an ad
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($data['ad_id']) ? intval($data['ad_id']) : 0;
$expires_days = isset($data['expires_days']) ? intval($data['expires_days']) : 30;

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ad_id required']);
    exit();
}

try {
    // Check if ad exists
    $check = $conn->prepare("SELECT id, title FROM ads WHERE id = :id");
    $check->execute([':id' => $ad_id]);
    if ($check->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Ad not found']);
        exit();
    }

    // Auto-create table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_share_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_ad (ad_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Check for existing valid token
    $existing = $conn->prepare("
        SELECT token, expires_at FROM ad_share_tokens 
        WHERE ad_id = :id AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY created_at DESC LIMIT 1
    ");
    $existing->execute([':id' => $ad_id]);
    $row = $existing->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            'success' => true,
            'token' => $row['token'],
            'expires_at' => $row['expires_at'],
            'is_new' => false
        ]);
        exit();
    }

    // Generate new token
    $token = bin2hex(random_bytes(24));
    $expires_at = $expires_days > 0 ? date('Y-m-d H:i:s', strtotime("+{$expires_days} days")) : null;

    $stmt = $conn->prepare("
        INSERT INTO ad_share_tokens (ad_id, token, expires_at) 
        VALUES (:ad_id, :token, :expires_at)
    ");
    $stmt->execute([
        ':ad_id' => $ad_id,
        ':token' => $token,
        ':expires_at' => $expires_at
    ]);

    echo json_encode([
        'success' => true,
        'token' => $token,
        'expires_at' => $expires_at,
        'is_new' => true
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>