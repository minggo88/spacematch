<?php
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("success" => false, "message" => "Unauthorized."));
    exit;
}

$user_id = $_SESSION['user_id'];
$role = isset($_SESSION['user_role']) ? trim((string) $_SESSION['user_role']) : '';

// 세션 user_role 이 DB와 다르면 관리자가 seller 분기로 조회되어 목록이 비는 등 문제 발생 → DB 기준 동기화
try {
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $roleStmt->execute([$user_id]);
    $rrow = $roleStmt->fetch(PDO::FETCH_ASSOC);
    if ($rrow && array_key_exists('role', $rrow) && $rrow['role'] !== null && $rrow['role'] !== '') {
        $role = trim((string) $rrow['role']);
        $_SESSION['user_role'] = $role;
    }
} catch (Exception $e) { /* keep session role */
}

$roleNorm = strtolower(str_replace('super_admin', 'superadmin', $role));
$isAdmin = in_array($roleNorm, array('admin', 'superadmin'), true);
$isHost = ($roleNorm === 'host');

// Auto-migrate: add is_priority column (once per session)
if (empty($_SESSION['_ddl_applications'])) {
    try {
        $conn->exec("ALTER TABLE applications ADD COLUMN is_priority TINYINT(1) DEFAULT 0");
    } catch (Exception $e) { /* column likely exists or no ALTER privilege */
    }
    $_SESSION['_ddl_applications'] = true;
}

$hasIsPriority = false;
$hasSellerId = false;
try {
    $cc = $conn->query("SHOW COLUMNS FROM applications LIKE 'is_priority'");
    $hasIsPriority = $cc && $cc->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) { /* ignore */
}
try {
    $cc2 = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
    $hasSellerId = $cc2 && $cc2->fetch(PDO::FETCH_ASSOC);
} catch (Exception $e) { /* ignore */
}

$orderApps = $hasIsPriority
    ? 'a.is_priority DESC, a.created_at DESC'
    : 'a.created_at DESC';

// 레거시: user_id 비어 있고 seller_id만 있는 행 → 사용자 조인 매칭
$userJoinOn = $hasSellerId
    ? 'u.id = COALESCE(NULLIF(a.user_id, 0), NULLIF(a.seller_id, 0))'
    : 'u.id = a.user_id';

$jsonFlags = defined('JSON_INVALID_UTF8_SUBSTITUTE') ? JSON_INVALID_UTF8_SUBSTITUTE : 0;

try {
    if ($isAdmin) {
        // a.* 에 이미 venue_name 이 있으면 PDO 연관 배열에서 COALESCE 결과가 덮어써지지 않을 수 있음 → 고유 별칭 후 PHP에서 병합
        $query = "SELECT a.*,
              COALESCE(NULLIF(TRIM(COALESCE(v.name, '')), ''), NULLIF(TRIM(COALESCE(a.venue_name, '')), ''), '(연결되지 않은 공간)') AS _sm_resolved_venue_name,
              COALESCE(NULLIF(TRIM(COALESCE(u.name, '')), ''), NULLIF(TRIM(COALESCE(a.seller_name, '')), ''), '(알 수 없음)') AS _sm_resolved_applicant_name,
              COALESCE(u.email, '') AS applicant_email,
              COALESCE(u.phone, '') AS applicant_phone,
              u.category AS sellerCategory,
              u.instagram,
              u.description
              FROM applications a
              LEFT JOIN venues v ON a.venue_id = v.id
              LEFT JOIN users u ON ({$userJoinOn})
              ORDER BY {$orderApps}";
        $stmt = $conn->prepare($query);
        $stmt->execute();
    } elseif ($isHost) {
        $query = "SELECT a.*, v.name as venue_name, v.images as venue_images, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone, u.category as applicant_category, u.instagram as applicant_instagram, u.description as applicant_description, u.brand_name as applicant_brand, u.keywords as applicant_keywords, u.created_at as applicant_joined_at, u.is_verified
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              JOIN users u ON ({$userJoinOn})
              WHERE v.owner_id = ? 
              ORDER BY {$orderApps}";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
    } else {
        if ($hasSellerId) {
            $query = "SELECT a.*, v.name as venue_name, v.location as venue_location, v.price as venue_price, v.images as venue_images 
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              WHERE COALESCE(NULLIF(a.user_id, 0), NULLIF(a.seller_id, 0)) = ? 
              ORDER BY {$orderApps}";
        } else {
            $query = "SELECT a.*, v.name as venue_name, v.location as venue_location, v.price as venue_price, v.images as venue_images 
              FROM applications a 
              JOIN venues v ON a.venue_id = v.id 
              WHERE a.user_id = ? 
              ORDER BY {$orderApps}";
        }
        $stmt = $conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    error_log('[get_applications] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "입점 목록을 불러오지 못했습니다."));
    exit;
}

// 관리자 쿼리: a.* 와 동일 컬럼명 별칭 충돌 방지 — 병합된 표시용 이름 반영
foreach ($results as &$row) {
    if (array_key_exists('_sm_resolved_venue_name', $row)) {
        $row['venue_name'] = $row['_sm_resolved_venue_name'];
        unset($row['_sm_resolved_venue_name']);
    }
    if (array_key_exists('_sm_resolved_applicant_name', $row)) {
        $row['applicant_name'] = $row['_sm_resolved_applicant_name'];
        unset($row['_sm_resolved_applicant_name']);
    }
}
unset($row);

// Decode HTML entities and images JSON
foreach ($results as &$row) {
    decode_fields($row, ['applicant_name', 'venue_name', 'description', 'instagram', 'applicant_description', 'applicant_brand', 'applicant_category']);
    if (isset($row['venue_images'])) {
        $row['venue_images'] = json_decode($row['venue_images']);
    }
    if (isset($row['applicant_keywords'])) {
        $decoded = json_decode($row['applicant_keywords']);
        $row['applicant_keywords'] = is_array($decoded) ? $decoded : [];
    }
    if (isset($row['selected_period'])) {
        $row['selected_period'] = json_decode($row['selected_period']);
    }
    if (isset($row['attachments'])) {
        $decoded = json_decode($row['attachments']);
        $row['attachments'] = is_array($decoded) ? $decoded : [];
    }
}

echo json_encode($results, $jsonFlags);
