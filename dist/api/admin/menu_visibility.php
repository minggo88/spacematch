<?php
// Admin: Menu Visibility Management API
include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Create table — scope_value uses '' (empty string) instead of NULL for global scope
// This avoids MySQL UNIQUE KEY NULL issues with ON DUPLICATE KEY UPDATE
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
    // Table already exists
}

// Robust migration: fix legacy NULL scope_value rows
try {
    // Step 1: Delete NULL rows that already have a '' counterpart (avoid dup key on update)
    $conn->exec("DELETE a FROM menu_visibility_rules a
        INNER JOIN menu_visibility_rules b
        ON a.role = b.role AND a.menu_key = b.menu_key AND a.scope = b.scope AND b.scope_value = ''
        WHERE a.scope_value IS NULL");

    // Step 2: Update remaining NULL rows to ''
    $conn->exec("UPDATE menu_visibility_rules SET scope_value = '' WHERE scope_value IS NULL");

    // Step 3: Alter column to NOT NULL to prevent future NULLs
    $conn->exec("ALTER TABLE menu_visibility_rules MODIFY COLUMN scope_value VARCHAR(100) NOT NULL DEFAULT ''");
} catch (PDOException $e) {
    // Already migrated or no NULL rows
}

$method = $_SERVER['REQUEST_METHOD'];

// GET - Fetch rules
if ($method === 'GET') {
    $role = isset($_GET['role']) ? trim($_GET['role']) : '';
    $scope = isset($_GET['scope']) ? trim($_GET['scope']) : '';
    $scope_value = isset($_GET['scope_value']) ? trim($_GET['scope_value']) : '';

    if (!in_array($role, ['seller', 'host'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid role']);
        exit;
    }

    try {
        $where = "role = ?";
        $params = [$role];

        if ($scope) {
            $where .= " AND scope = ?";
            $params[] = $scope;
        }
        if ($scope_value) {
            $where .= " AND scope_value = ?";
            $params[] = $scope_value;
        }

        $stmt = $conn->prepare("SELECT id, role, menu_key, scope, scope_value, is_visible, updated_by, updated_at FROM menu_visibility_rules WHERE $where ORDER BY scope ASC, menu_key ASC");
        $stmt->execute($params);
        $rules = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Supported countries: matches language selector (KR, US, GB, CA, JP, VN, TH, KH, RU, UA)
        $supportedCountries = ['KR', 'US', 'GB', 'CA', 'JP', 'VN', 'TH', 'KH', 'RU', 'UA'];
        $countryStmt = $conn->prepare("SELECT DISTINCT country FROM users WHERE country IS NOT NULL AND country != '' ORDER BY country");
        $countryStmt->execute();
        $dbCountries = $countryStmt->fetchAll(PDO::FETCH_COLUMN);
        $countries = array_values(array_unique(array_merge($supportedCountries, $dbCountries)));

        // Fetch users for the user-level scope
        $users = [];
        if ($scope === 'user' || (isset($_GET['fetch_users']) && $_GET['fetch_users'])) {
            $search = isset($_GET['user_search']) ? trim($_GET['user_search']) : '';
            $userRole = isset($_GET['user_role']) ? trim($_GET['user_role']) : $role;
            $userQuery = "SELECT id, name, email, country, role FROM users WHERE role = ?";
            $userParams = [$userRole];
            if ($search) {
                $userQuery .= " AND (name LIKE ? OR email LIKE ? OR id LIKE ?)";
                $userParams[] = "%$search%";
                $userParams[] = "%$search%";
                $userParams[] = "%$search%";
            }
            $userQuery .= " ORDER BY name ASC LIMIT 100";
            $userStmt = $conn->prepare($userQuery);
            $userStmt->execute($userParams);
            $users = $userStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            'success' => true,
            'rules' => $rules,
            'countries' => $countries,
            'users' => $users
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

// POST - Save rules (upsert)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['rules']) || !is_array($data['rules'])) {
        echo json_encode(['success' => false, 'message' => 'rules array required']);
        exit;
    }

    $admin_id = $_SESSION['user_id'];

    try {
        $conn->beginTransaction();

        $upsertStmt = $conn->prepare("INSERT INTO menu_visibility_rules (role, menu_key, scope, scope_value, is_visible, updated_by)
            VALUES (:role, :menu_key, :scope, :scope_value, :is_visible, :updated_by)
            ON DUPLICATE KEY UPDATE is_visible = VALUES(is_visible), updated_by = VALUES(updated_by), updated_at = NOW()");

        foreach ($data['rules'] as $rule) {
            if (!isset($rule['role'], $rule['menu_key'], $rule['scope']))
                continue;
            if (!in_array($rule['role'], ['seller', 'host']))
                continue;
            if (!in_array($rule['scope'], ['global', 'country', 'user']))
                continue;

            // Use '' instead of NULL for scope_value to ensure UNIQUE KEY works
            $scopeVal = '';
            if ($rule['scope'] === 'country')
                $scopeVal = $rule['scope_value'] ?? '';
            if ($rule['scope'] === 'user')
                $scopeVal = $rule['scope_value'] ?? '';
            if ($rule['scope'] !== 'global' && $scopeVal === '')
                continue;

            $upsertStmt->execute([
                ':role' => $rule['role'],
                ':menu_key' => $rule['menu_key'],
                ':scope' => $rule['scope'],
                ':scope_value' => $scopeVal,
                ':is_visible' => intval($rule['is_visible'] ?? 1),
                ':updated_by' => $admin_id
            ]);
        }

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Saved']);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

// DELETE - Remove specific override rules
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['role'], $data['scope'], $data['scope_value'])) {
        echo json_encode(['success' => false, 'message' => 'role, scope, scope_value required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM menu_visibility_rules WHERE role = ? AND scope = ? AND scope_value = ?");
        $stmt->execute([$data['role'], $data['scope'], $data['scope_value']]);
        echo json_encode(['success' => true, 'message' => 'Deleted', 'deleted' => $stmt->rowCount()]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
?>