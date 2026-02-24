<?php
// Admin: Get/Update security settings
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Only admin/superadmin can manage security settings
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Ensure security_settings table exists
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS security_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value VARCHAR(500) NOT NULL DEFAULT '',
        updated_by INT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) { /* table may already exist */
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Return all security settings
    try {
        $stmt = $conn->query("SELECT setting_key, setting_value FROM security_settings");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        // Default values if not set
        $defaults = [
            'maintenance_mode' => '0',
            'force_https' => '1',
            'block_suspicious_ips' => '1',
            'max_login_attempts' => '5',
            'session_timeout_minutes' => '60',
            'allow_registration' => '1',
            'enable_api_rate_limit' => '1',
            'disable_devtools_block' => '0',
        ];

        foreach ($defaults as $key => $val) {
            if (!isset($settings[$key])) {
                $settings[$key] = $val;
            }
        }

        echo json_encode(['success' => true, 'settings' => $settings]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Update security settings
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['settings']) || !is_array($data['settings'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request body']);
        exit();
    }

    $allowed_keys = [
        'maintenance_mode',
        'force_https',
        'block_suspicious_ips',
        'max_login_attempts',
        'session_timeout_minutes',
        'allow_registration',
        'enable_api_rate_limit',
        'disable_devtools_block'
    ];

    try {
        $stmt = $conn->prepare("INSERT INTO security_settings (setting_key, setting_value, updated_by)
            VALUES (:key, :value, :user_id)
            ON DUPLICATE KEY UPDATE setting_value = :value2, updated_by = :user_id2, updated_at = NOW()");

        $updated = 0;
        foreach ($data['settings'] as $key => $value) {
            if (in_array($key, $allowed_keys)) {
                $stmt->execute([
                    ':key' => $key,
                    ':value' => strval($value),
                    ':user_id' => $_SESSION['user_id'],
                    ':value2' => strval($value),
                    ':user_id2' => $_SESSION['user_id']
                ]);
                $updated++;
            }
        }

        echo json_encode(['success' => true, 'updated' => $updated]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>