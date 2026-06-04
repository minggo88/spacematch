<?php
/**
 * Popup Management API
 * GET    — list active popups (public) or all (admin, ?admin=1)
 * POST   — create popup (admin only, multipart/form-data)
 * PUT    — update popup (admin only, JSON)
 * DELETE — delete popup (admin only, JSON)
 */
@ini_set('upload_max_filesize', '500M');
@ini_set('post_max_size', '500M');
@ini_set('memory_limit', '512M');

include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Auto-create popups table
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS popups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        popup_type ENUM('notice','ad') NOT NULL DEFAULT 'notice',
        title VARCHAR(2000) NOT NULL,
        content TEXT DEFAULT NULL,
        image_url VARCHAR(500) DEFAULT '',
        click_url VARCHAR(500) DEFAULT '',
        target_role VARCHAR(20) DEFAULT 'all',
        priority INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_type (popup_type)
    )");
} catch (PDOException $e) {
    // Table likely already exists
}

// Add translations column for multi-language support
try {
    $conn->query("SELECT translations FROM popups LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE popups ADD COLUMN translations JSON DEFAULT NULL AFTER content");
}

// Add target_countries column for country-specific popups
try {
    $conn->query("SELECT target_countries FROM popups LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE popups ADD COLUMN target_countries VARCHAR(500) DEFAULT 'all' AFTER target_role");
}

// Expand title column if still VARCHAR(200)
try {
    $col = $conn->query("SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'popups' AND COLUMN_NAME = 'title'")->fetch(PDO::FETCH_ASSOC);
    if ($col && stripos($col['COLUMN_TYPE'], 'varchar(200)') !== false) {
        $conn->exec("ALTER TABLE popups MODIFY COLUMN title VARCHAR(2000) NOT NULL");
    }
} catch (PDOException $e) {
    // ignore
}

$is_admin = isset($_SESSION['user_id']) && in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin']);
$user_role = $_SESSION['user_role'] ?? '';

// ===== GET =====
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $admin_mode = isset($_GET['admin']) && intval($_GET['admin']) === 1;

    if ($admin_mode) {
        // Admin: return all popups
        if (!$is_admin) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }
        try {
            $stmt = $conn->query("SELECT * FROM popups ORDER BY priority DESC, created_at DESC");
            $popups = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'popups' => $popups]);
        } catch (PDOException $e) {
            http_response_code(500);
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
        }
    } else {
        // Public: return active popups for the user's role and country
        $today = date('Y-m-d');
        $userLang = isset($_GET['lang']) ? trim($_GET['lang']) : '';
        try {
            // Admin/superadmin sees ALL active popups; regular users see filtered by role
            if ($is_admin) {
                $stmt = $conn->prepare("
                    SELECT id, popup_type, title, content, translations, image_url, click_url, target_role, target_countries, priority
                    FROM popups
                    WHERE is_active = 1
                      AND (start_date IS NULL OR start_date <= ?)
                      AND (end_date IS NULL OR end_date >= ?)
                    ORDER BY priority DESC, created_at DESC
                ");
                $stmt->execute([$today, $today]);
            } else {
                $stmt = $conn->prepare("
                    SELECT id, popup_type, title, content, translations, image_url, click_url, target_role, target_countries, priority
                    FROM popups
                    WHERE is_active = 1
                      AND (start_date IS NULL OR start_date <= ?)
                      AND (end_date IS NULL OR end_date >= ?)
                      AND (target_role = 'all' OR target_role = ?)
                    ORDER BY priority DESC, created_at DESC
                ");
                $stmt->execute([$today, $today, $user_role]);
            }
            $allPopups = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Filter by target_countries
            $popups = [];
            foreach ($allPopups as $p) {
                $tc = $p['target_countries'] ?? 'all';
                if ($tc === 'all' || empty($tc)) {
                    $popups[] = $p;
                } else if ($userLang) {
                    $countries = array_map('trim', explode(',', $tc));
                    if (in_array($userLang, $countries)) {
                        $popups[] = $p;
                    }
                } else {
                    // No lang specified, show 'all' only
                    // But include anyway to let frontend filter
                    $popups[] = $p;
                }
            }

            echo json_encode(['success' => true, 'popups' => $popups]);
        } catch (PDOException $e) {
            http_response_code(500);
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
        }
    }
    exit;
}

// ===== POST (Create) =====
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$is_admin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $popup_type = isset($_POST['popup_type']) ? trim($_POST['popup_type']) : 'notice';
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $content = isset($_POST['content']) ? trim($_POST['content']) : '';
    $translations = isset($_POST['translations']) ? $_POST['translations'] : null;
    $click_url = isset($_POST['click_url']) ? trim($_POST['click_url']) : '';
    $target_role = isset($_POST['target_role']) ? trim($_POST['target_role']) : 'all';
    $target_countries = isset($_POST['target_countries']) ? trim($_POST['target_countries']) : 'all';
    $priority = isset($_POST['priority']) ? intval($_POST['priority']) : 0;
    $is_active = isset($_POST['is_active']) ? intval($_POST['is_active']) : 1;
    $start_date = isset($_POST['start_date']) && $_POST['start_date'] ? $_POST['start_date'] : null;
    $end_date = isset($_POST['end_date']) && $_POST['end_date'] ? $_POST['end_date'] : null;

    // If Korean title is empty, try to use a title from translations
    if (empty($title) && !empty($translations)) {
        $trans = json_decode($translations, true);
        if (is_array($trans)) {
            foreach ($trans as $lang => $tr) {
                if (!empty($tr['title'])) {
                    $title = trim($tr['title']);
                    break;
                }
            }
        }
    }

    if (empty($title)) {
        echo json_encode(['success' => false, 'message' => '제목을 입력하세요.']);
        exit;
    }

    // Handle image upload
    $image_url = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $realMime = finfo_file($finfo, $_FILES['image']['tmp_name']);
        finfo_close($finfo);
        if (!in_array($realMime, $allowed)) {
            echo json_encode(['success' => false, 'message' => '허용된 이미지 형식: JPG, PNG, GIF, WebP']);
            exit;
        }

        $doc_root = $_SERVER['DOCUMENT_ROOT'];
        $app_base = '';
        if (preg_match('#(/[^/]+)(/api/|/uploads/)#', $_SERVER['SCRIPT_NAME'], $m)) {
            $app_base = $m[1];
        }

        $upload_dir = $doc_root . $app_base . '/uploads/popups/';
        if (!is_dir($upload_dir))
            @mkdir($upload_dir, 0755, true);
        if (!is_dir($upload_dir) || !is_writable($upload_dir)) {
            $upload_dir = dirname(dirname(__DIR__)) . '/uploads/popups/';
            if (!is_dir($upload_dir))
                @mkdir($upload_dir, 0755, true);
        }

        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = 'popup_' . time() . '_' . uniqid() . '.' . $ext;
        $filepath = $upload_dir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $filepath)) {
            $image_url = $app_base . '/uploads/popups/' . $filename;
        }
    }

    try {
        $stmt = $conn->prepare("INSERT INTO popups (popup_type, title, content, translations, image_url, click_url, target_role, target_countries, priority, is_active, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$popup_type, $title, $content, $translations, $image_url, $click_url, $target_role, $target_countries, $priority, $is_active, $start_date, $end_date]);
        $newId = $conn->lastInsertId();
        echo json_encode(['success' => true, 'id' => $newId, 'message' => '팝업이 등록되었습니다.']);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

// ===== PUT (Update) =====
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!$is_admin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }

    // Build dynamic update
    $fields = [];
    $params = [];
    $allowedFields = ['popup_type', 'title', 'content', 'translations', 'image_url', 'click_url', 'target_role', 'target_countries', 'priority', 'is_active', 'start_date', 'end_date'];
    foreach ($allowedFields as $f) {
        if (array_key_exists($f, $data)) {
            $fields[] = "$f = ?";
            $val = $data[$f];
            // Handle null dates
            if (($f === 'start_date' || $f === 'end_date') && empty($val))
                $val = null;
            $params[] = $val;
        }
    }

    if (empty($fields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit;
    }

    $params[] = $id;

    try {
        $sql = "UPDATE popups SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true, 'message' => '팝업이 수정되었습니다.']);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

// ===== DELETE =====
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!$is_admin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM popups WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Popup deleted.']);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request method']);
?>