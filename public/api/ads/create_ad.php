<?php
// Admin: Create ad with image upload
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '512M');
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$slot_id = isset($_POST['slot_id']) ? trim($_POST['slot_id']) : '';
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$click_url = isset($_POST['click_url']) ? trim($_POST['click_url']) : null;
$start_date = isset($_POST['start_date']) && $_POST['start_date'] ? $_POST['start_date'] : null;
$end_date = isset($_POST['end_date']) && $_POST['end_date'] ? $_POST['end_date'] : null;
$is_active = isset($_POST['is_active']) ? intval($_POST['is_active']) : 1;
$priority = isset($_POST['priority']) ? intval($_POST['priority']) : 0;
$campaign_id = isset($_POST['campaign_id']) && $_POST['campaign_id'] !== '' ? intval($_POST['campaign_id']) : null;
$target_countries = isset($_POST['target_countries']) ? trim($_POST['target_countries']) : 'all';

if (empty($slot_id) || empty($title)) {
    echo json_encode(['success' => false, 'message' => 'slot_id and title required']);
    exit();
}

// Detect app base path dynamically
$doc_root = $_SERVER['DOCUMENT_ROOT'];
$script_dir = dirname($_SERVER['SCRIPT_FILENAME']);
$app_base = '';
if (preg_match('#(/[^/]+)(/api/|/uploads/)#', $_SERVER['SCRIPT_NAME'], $m)) {
    $app_base = $m[1]; // e.g. '/spacematch'
}

$upload_dir = $doc_root . $app_base . '/uploads/ads/';
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}

// Fallback to relative path if DOCUMENT_ROOT-based path fails
if (!is_dir($upload_dir) || !is_writable($upload_dir)) {
    $upload_dir = dirname(dirname(__DIR__)) . '/uploads/ads/';
    if (!is_dir($upload_dir)) {
        @mkdir($upload_dir, 0755, true);
    }
}

// Handle PC image upload (required)
$image_url = '';
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($_FILES['image']['type'], $allowed)) {
        echo json_encode(['success' => false, 'message' => '허용된 이미지 형식: JPG, PNG, GIF, WebP']);
        exit();
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = 'ad_' . time() . '_' . uniqid() . '.' . $ext;
    $filepath = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $filepath)) {
        $image_url = $app_base . '/uploads/ads/' . $filename;
    } else {
        echo json_encode(['success' => false, 'message' => 'Image upload failed.']);
        exit();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Image file is required.']);
    exit();
}

// Handle mobile image upload (optional)
$mobile_image_url = null;
if (isset($_FILES['mobile_image']) && $_FILES['mobile_image']['error'] === UPLOAD_ERR_OK) {

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($_FILES['mobile_image']['type'], $allowed)) {
        echo json_encode(['success' => false, 'message' => '모바일 이미지: 허용된 형식 JPG, PNG, GIF, WebP']);
        exit();
    }

    $ext = pathinfo($_FILES['mobile_image']['name'], PATHINFO_EXTENSION);
    $filename = 'ad_mobile_' . time() . '_' . uniqid() . '.' . $ext;
    $filepath = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['mobile_image']['tmp_name'], $filepath)) {
        $mobile_image_url = $app_base . '/uploads/ads/' . $filename;
    }
}

try {
    $stmt = $conn->prepare("
        INSERT INTO ads (slot_id, title, image_url, mobile_image_url, click_url, start_date, end_date, is_active, priority, campaign_id, target_countries)
        VALUES (:slot_id, :title, :image_url, :mobile_image_url, :click_url, :start_date, :end_date, :is_active, :priority, :campaign_id, :target_countries)
    ");
    $stmt->execute([
        ':slot_id' => $slot_id,
        ':title' => $title,
        ':image_url' => $image_url,
        ':mobile_image_url' => $mobile_image_url,
        ':click_url' => $click_url,
        ':start_date' => $start_date,
        ':end_date' => $end_date,
        ':is_active' => $is_active,
        ':priority' => $priority,
        ':campaign_id' => $campaign_id,
        ':target_countries' => $target_countries
    ]);

    $new_id = $conn->lastInsertId();
    echo json_encode(['success' => true, 'id' => $new_id, 'message' => '광고가 등록되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>