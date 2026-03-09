<?php
// Public: Get active ad for a specific slot
include_once '../db_connect.php';
session_start();

$slot_id = isset($_GET['slot_id']) ? trim($_GET['slot_id']) : '';
$country = isset($_GET['country']) ? trim($_GET['country']) : '';

if (empty($slot_id)) {
    echo json_encode(['success' => false, 'message' => 'slot_id required']);
    exit();
}

try {
    $today = date('Y-m-d');

    $country_condition = '';
    $params = [
        ':slot_id' => $slot_id,
        ':today1' => $today,
        ':today2' => $today
    ];

    if ($country && $country !== 'all') {
        $country_condition = "AND (target_countries = 'all' OR FIND_IN_SET(:country, target_countries) > 0)";
        $params[':country'] = $country;
    }

    $stmt = $conn->prepare("
        SELECT id, slot_id, title, image_url, mobile_image_url, click_url
        FROM ads
        WHERE slot_id = :slot_id
          AND is_active = 1
          AND (start_date IS NULL OR start_date <= :today1)
          AND (end_date IS NULL OR end_date >= :today2)
          $country_condition
        ORDER BY priority DESC, RAND()
        LIMIT 1
    ");
    $stmt->execute($params);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($ad) {
        // Increment view count (non-blocking — don't prevent ad display if this fails)
        try {
            $update = $conn->prepare("UPDATE ads SET view_count = view_count + 1 WHERE id = :id");
            $update->execute([':id' => $ad['id']]);

            // Also record in daily stats
            $daily = $conn->prepare("
                INSERT INTO ad_daily_stats (ad_id, stat_date, views) VALUES (:id, CURDATE(), 1)
                ON DUPLICATE KEY UPDATE views = views + 1
            ");
            $daily->execute([':id' => $ad['id']]);
        } catch (Exception $ignore) { /* view tracking failure should not block ad display */
        }

        echo json_encode(['success' => true, 'ad' => $ad]);
    } else {
        echo json_encode(['success' => true, 'ad' => null]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>