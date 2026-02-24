<?php
// Public: Get menu visibility for current logged-in user
// Returns list of hidden menu keys based on: global → country → user priority
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'] ?? '';

// Admins see all menus
if (in_array($user_role, ['admin', 'superadmin'])) {
    echo json_encode(['success' => true, 'hiddenMenus' => []]);
    exit;
}

if (!in_array($user_role, ['seller', 'host'])) {
    echo json_encode(['success' => true, 'hiddenMenus' => []]);
    exit;
}

// Create table if not exists (safety)
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS menu_visibility_rules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role ENUM('seller','host') NOT NULL,
        menu_key VARCHAR(100) NOT NULL,
        scope ENUM('global','country','user') NOT NULL,
        scope_value VARCHAR(100) NOT NULL DEFAULT '',
        is_visible TINYINT(1) DEFAULT 1,
        updated_by INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_rule (role, menu_key, scope, scope_value)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // Already exists
}

try {
    // Get user's country
    $userStmt = $conn->prepare("SELECT country FROM users WHERE id = ?");
    $userStmt->execute([$user_id]);
    $userData = $userStmt->fetch(PDO::FETCH_ASSOC);
    $userCountry = $userData['country'] ?? '';

    // Fetch all rules for this role (exclude any legacy NULL scope_value rows)
    $stmt = $conn->prepare("SELECT menu_key, scope, scope_value, is_visible FROM menu_visibility_rules WHERE role = ? AND scope_value IS NOT NULL");
    $stmt->execute([$user_role]);
    $rules = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Build visibility map with correct priority: global < country < user
    $finalMap = [];

    // Pass 1: global (scope_value = '')
    foreach ($rules as $rule) {
        if ($rule['scope'] === 'global') {
            $finalMap[$rule['menu_key']] = intval($rule['is_visible']);
        }
    }

    // Pass 2: country (overwrites global)
    if ($userCountry) {
        foreach ($rules as $rule) {
            if ($rule['scope'] === 'country' && $rule['scope_value'] === $userCountry) {
                $finalMap[$rule['menu_key']] = intval($rule['is_visible']);
            }
        }
    }

    // Pass 3: user (overwrites everything)
    foreach ($rules as $rule) {
        if ($rule['scope'] === 'user' && $rule['scope_value'] == $user_id) {
            $finalMap[$rule['menu_key']] = intval($rule['is_visible']);
        }
    }

    // Collect hidden menus (is_visible = 0)
    $hiddenMenus = [];
    foreach ($finalMap as $menuKey => $isVisible) {
        if ($isVisible == 0) {
            $hiddenMenus[] = $menuKey;
        }
    }

    echo json_encode(['success' => true, 'hiddenMenus' => $hiddenMenus]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>