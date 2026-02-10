<?php
// Public: Get active ad for a specific slot
include_once '../db_connect.php';
session_start();

$slot_id = isset($_GET['slot_id']) ? trim($_GET['slot_id']) : '';

if (empty($slot_id)) {
    echo json_encode(['success' => false, 'message' => 'slot_id required']);
    exit();
}

try {
    $today = date('Y-m-d');
    $stmt = $conn->prepare("
        SELECT id, slot_id, title, image_url, click_url
        FROM ads
        WHERE slot_id = :slot_id
          AND is_active = 1
          AND (start_date IS NULL OR start_date <= :today1)
          AND (end_date IS NULL OR end_date >= :today2)
        ORDER BY priority DESC, RAND()
        LIMIT 1
    ");
    $stmt->execute([
        ':slot_id' => $slot_id,
        ':today1' => $today,
        ':today2' => $today
    ]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($ad) {
        // Increment impressions
        $update = $conn->prepare("UPDATE ads SET impressions = impressions + 1 WHERE id = :id");
        $update->execute([':id' => $ad['id']]);

        echo json_encode(['success' => true, 'ad' => $ad]);
    } else {
        echo json_encode(['success' => true, 'ad' => null]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>