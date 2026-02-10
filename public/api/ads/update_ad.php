<?php
// Admin: Update ad
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$ad_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'id required']);
    exit();
}

$slot_id = isset($_POST['slot_id']) ? trim($_POST['slot_id']) : '';
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$click_url = isset($_POST['click_url']) ? trim($_POST['click_url']) : null;
$start_date = isset($_POST['start_date']) && $_POST['start_date'] ? $_POST['start_date'] : null;
$end_date = isset($_POST['end_date']) && $_POST['end_date'] ? $_POST['end_date'] : null;
$is_active = isset($_POST['is_active']) ? intval($_POST['is_active']) : 1;
$priority = isset($_POST['priority']) ? intval($_POST['priority']) : 0;

if (empty($slot_id) || empty($title)) {
    echo json_encode(['success' => false, 'message' => 'slot_id and title required']);
    exit();
}

// Handle optional image update
$image_sql = '';
$image_url = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($_FILES['image']['type'], $allowed)) {
        echo json_encode(['success' => false, 'message' => '허용된 이미지 형식: JPG, PNG, GIF, WebP']);
        exit();
    }

    $upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/spacematch/uploads/ads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = 'ad_' . time() . '_' . uniqid() . '.' . $ext;
    $filepath = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $filepath)) {
        $image_url = '/spacematch/uploads/ads/' . $filename;
        $image_sql = ', image_url = :image_url';

        // Delete old image
        $old = $conn->prepare("SELECT image_url FROM ads WHERE id = :id");
        $old->execute([':id' => $ad_id]);
        $old_row = $old->fetch(PDO::FETCH_ASSOC);
        if ($old_row && $old_row['image_url']) {
            $old_path = $_SERVER['DOCUMENT_ROOT'] . $old_row['image_url'];
            if (file_exists($old_path))
                @unlink($old_path);
        }
    }
}

try {
    $sql = "UPDATE ads SET slot_id = :slot_id, title = :title, click_url = :click_url,
            start_date = :start_date, end_date = :end_date, is_active = :is_active,
            priority = :priority $image_sql WHERE id = :id";

    $params = [
        ':slot_id' => $slot_id,
        ':title' => $title,
        ':click_url' => $click_url,
        ':start_date' => $start_date,
        ':end_date' => $end_date,
        ':is_active' => $is_active,
        ':priority' => $priority,
        ':id' => $ad_id
    ];

    if ($image_url) {
        $params[':image_url'] = $image_url;
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => '광고가 수정되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>