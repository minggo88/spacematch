<?php
// Admin: Copy/duplicate an ad including its image file
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

$input = json_decode(file_get_contents('php://input'), true);
$ad_id = isset($input['id']) ? intval($input['id']) : 0;

if ($ad_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'id required']);
    exit();
}

try {
    // Fetch original ad
    $stmt = $conn->prepare("SELECT * FROM ads WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ad) {
        echo json_encode(['success' => false, 'message' => 'Original ad not found.']);
        exit();
    }

    // Copy image file if exists
    $new_image_url = $ad['image_url'];
    if ($ad['image_url']) {
        $doc_root = $_SERVER['DOCUMENT_ROOT'];
        $app_base = '';
        if (preg_match('#(/[^/]+)(/api/|/uploads/)#', $_SERVER['SCRIPT_NAME'], $m)) {
            $app_base = $m[1];
        }

        $old_path = $doc_root . $ad['image_url'];
        // Fallback to relative path
        if (!file_exists($old_path)) {
            $old_path = dirname(dirname(__DIR__)) . str_replace($app_base, '', $ad['image_url']);
        }

        if (file_exists($old_path)) {
            $ext = pathinfo($old_path, PATHINFO_EXTENSION);
            $new_filename = 'ad_' . time() . '_' . uniqid() . '.' . $ext;

            $upload_dir = $doc_root . $app_base . '/uploads/ads/';
            if (!is_dir($upload_dir)) {
                @mkdir($upload_dir, 0755, true);
            }
            if (!is_dir($upload_dir) || !is_writable($upload_dir)) {
                $upload_dir = dirname(dirname(__DIR__)) . '/uploads/ads/';
                if (!is_dir($upload_dir)) {
                    @mkdir($upload_dir, 0755, true);
                }
            }

            $new_path = $upload_dir . $new_filename;
            if (copy($old_path, $new_path)) {
                $new_image_url = $app_base . '/uploads/ads/' . $new_filename;
            }
        }
    }

    // Insert copied ad
    $stmt = $conn->prepare("
        INSERT INTO ads (slot_id, title, image_url, click_url, start_date, end_date, is_active, priority, target_countries)
        VALUES (:slot_id, :title, :image_url, :click_url, :start_date, :end_date, :is_active, :priority, :target_countries)
    ");
    $stmt->execute([
        ':slot_id' => $ad['slot_id'],
        ':title' => $ad['title'] . ' (복사)',
        ':image_url' => $new_image_url,
        ':click_url' => $ad['click_url'],
        ':start_date' => null,
        ':end_date' => null,
        ':is_active' => 0,
        ':priority' => intval($ad['priority'] ?? 0),
        ':target_countries' => $ad['target_countries'] ?? 'all',
    ]);

    $new_id = $conn->lastInsertId();
    echo json_encode(['success' => true, 'id' => $new_id, 'message' => '광고가 이미지와 함께 복사되었습니다.']);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>