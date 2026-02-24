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
    $country_filter = isset($_GET['country']) ? trim($_GET['country']) : '';

    $sql = "SELECT a.*, a.campaign_id, c.name as campaign_name FROM ads a LEFT JOIN ad_campaigns c ON a.campaign_id = c.id";
    $params = [];
    $conditions = [];

    if ($slot_filter) {
        $conditions[] = "a.slot_id = :slot_id";
        $params[':slot_id'] = $slot_filter;
    }

    if ($country_filter && $country_filter !== 'all') {
        $conditions[] = "(a.target_countries = 'all' OR FIND_IN_SET(:country, a.target_countries) > 0)";
        $params[':country'] = $country_filter;
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " ORDER BY a.slot_id ASC, a.priority DESC, a.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'ads' => $ads]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>