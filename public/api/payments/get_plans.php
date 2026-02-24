<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Login required.']);
    exit;
}

try {
    $role = $_SESSION['user_role'] ?? ($_SESSION['role'] ?? '');
    $userRole = in_array($role, ['host']) ? 'host' : 'seller';

    // Get active plans (optionally filtered by target_role)
    $stmt = $conn->prepare("SELECT * FROM payment_plans WHERE is_active = 1 AND (target_role = 'all' OR target_role = ?) ORDER BY sort_order ASC, id ASC");
    $stmt->execute([$userRole]);
    $plans = $stmt->fetchAll();

    // Decode features JSON and apply translations
    $userLang = isset($_GET['lang']) ? trim($_GET['lang']) : '';
    foreach ($plans as &$p) {
        $p['features'] = json_decode($p['features'] ?? '[]', true) ?: [];
        $translations = json_decode($p['translations'] ?? '{}', true) ?: [];
        $p['translations'] = $translations;

        // If a language is requested and translations exist, apply them
        if ($userLang && $userLang !== 'ko' && isset($translations[$userLang])) {
            $tr = $translations[$userLang];
            if (!empty($tr['name']))
                $p['name'] = $tr['name'];
            if (!empty($tr['description']))
                $p['description'] = $tr['description'];
            if (!empty($tr['features']) && is_array($tr['features']))
                $p['features'] = $tr['features'];
        }
    }

    echo json_encode(['success' => true, 'plans' => $plans]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '플랜 조회에 실패했습니다.']);
}
?>