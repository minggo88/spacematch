<?php
/**
 * get_admin_promotions.php
 * 관리자 전용: 모든 프로모션 관리 데이터 (만료 포함)
 */
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit;
}

$role = isset($_SESSION['user_role']) ? trim((string) $_SESSION['user_role']) : '';
try {
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $roleStmt->execute([$_SESSION['user_id']]);
    $rrow = $roleStmt->fetch(PDO::FETCH_ASSOC);
    if ($rrow && array_key_exists('role', $rrow) && $rrow['role'] !== null && $rrow['role'] !== '') {
        $role = trim((string) $rrow['role']);
        $_SESSION['user_role'] = $role;
    }
} catch (Exception $e) { /* keep session role */
}

$roleNorm = strtolower(str_replace('super_admin', 'superadmin', $role));
if (!in_array($roleNorm, ['admin', 'superadmin'], true)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin privileges required.']);
    exit;
}

try {
    $conn->exec("CREATE TABLE IF NOT EXISTS venue_promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        tier VARCHAR(30) NOT NULL DEFAULT 'hot_top',
        featured_category VARCHAR(50) DEFAULT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        admin_note VARCHAR(255) DEFAULT NULL,
        display_order INT DEFAULT 0,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_venue (venue_id),
        INDEX idx_tier_dates (tier, start_date, end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    try {
        $conn->exec("ALTER TABLE venue_promotions MODIFY COLUMN tier VARCHAR(30) NOT NULL DEFAULT 'hot_top'");
    } catch (PDOException $e) { /* already migrated */
    }

    try {
        $conn->exec("ALTER TABLE venue_promotions ADD COLUMN featured_category VARCHAR(50) DEFAULT NULL AFTER tier");
    } catch (PDOException $e) { /* column already exists */
    }

    try {
        $conn->exec("ALTER TABLE venue_promotions ADD COLUMN snapshot_venue_name VARCHAR(255) DEFAULT NULL AFTER venue_id");
    } catch (PDOException $e) { /* column already exists */
    }

    if (empty($_SESSION['_vp_snapshot_backfill_3'])) {
        try {
            $conn->exec("UPDATE venue_promotions vp 
                INNER JOIN venues v ON v.id = vp.venue_id
                SET vp.snapshot_venue_name = NULLIF(TRIM(v.name), '')
                WHERE (vp.snapshot_venue_name IS NULL OR TRIM(vp.snapshot_venue_name) = '')
                  AND v.name IS NOT NULL AND TRIM(v.name) <> ''");
        } catch (PDOException $e) { /* ignore */
        }
        $_SESSION['_vp_snapshot_backfill_3'] = true;
    }

    // ── 전체 공간 목록 먼저 조회 → venue_id 로 이름·위치 보강 (메인 JOIN 실패·CAST 이슈 대비) ──
    $hasStatus = false;
    $hasImages = false;
    try {
        $cc = $conn->query("SHOW COLUMNS FROM venues LIKE 'status'");
        $hasStatus = $cc && $cc->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) { /* ignore */
    }
    try {
        $ci = $conn->query("SHOW COLUMNS FROM venues LIKE 'images'");
        $hasImages = $ci && $ci->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) { /* ignore */
    }

    $venueCols = 'id, name, location, type';
    if ($hasStatus) {
        $venueCols .= ', status';
    }
    if ($hasImages) {
        $venueCols .= ', images';
    }

    $venuesStmt = $conn->prepare("SELECT {$venueCols} FROM venues ORDER BY name ASC");
    $venuesStmt->execute();
    $allVenues = $venuesStmt->fetchAll(PDO::FETCH_ASSOC);
    $venueMap = array();
    foreach ($allVenues as $vr) {
        $vid = (int) ($vr['id'] ?? 0);
        if ($vid > 0) {
            $venueMap[$vid] = $vr;
        }
    }

    $today = date('Y-m-d');

    // vp.* 제거: 운영 DB에 예전/커스텀 컬럼(name 등)이 있으면 PDO 키가 겹쳐 venues.name이 가려질 수 있음
    $query = "SELECT 
                vp.id, vp.venue_id, vp.snapshot_venue_name, vp.tier, vp.featured_category,
                vp.start_date, vp.end_date, vp.admin_note, vp.display_order, vp.created_by, vp.created_at,
                COALESCE(
                  NULLIF(TRIM(COALESCE(v.name, '')), ''),
                  NULLIF(TRIM(COALESCE(vp.snapshot_venue_name, '')), ''),
                  NULLIF(CONCAT('공간 #', CAST(vp.venue_id AS CHAR)), ''),
                  '(연결되지 않은 공간)'
                ) AS _sm_resolved_venue_name,
                COALESCE(v.location, '') AS venue_location,
                COALESCE(v.type, '') AS venue_type,
                COALESCE(v.images, '[]') AS venue_images,
                COALESCE(v.status, '') AS venue_status,
                u.name as admin_name,
                CASE WHEN vp.end_date >= ? THEN 'active' ELSE 'expired' END as promo_status
              FROM venue_promotions vp
              LEFT JOIN venues v ON v.id = vp.venue_id
              LEFT JOIN users u ON vp.created_by = u.id
              ORDER BY vp.tier ASC, vp.display_order ASC, vp.end_date DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([$today]);
    $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 프로모션에 등장하는 venue_id만 재조회 → 전체 목록·조인과 무관하게 실제 venues 행 확보
    $promoVenueKeys = array();
    foreach ($promotions as $pr) {
        $pvid = (int) trim((string) ($pr['venue_id'] ?? ''));
        if ($pvid > 0) {
            $promoVenueKeys[$pvid] = true;
        }
    }
    $promoVenueIds = array_keys($promoVenueKeys);
    if (count($promoVenueIds) > 0) {
        $placeholders = implode(',', array_fill(0, count($promoVenueIds), '?'));
        $bulkStmt = $conn->prepare("SELECT {$venueCols} FROM venues WHERE id IN ({$placeholders})");
        $bulkStmt->execute($promoVenueIds);
        foreach ($bulkStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $vid = (int) ($row['id'] ?? 0);
            if ($vid > 0) {
                $venueMap[$vid] = $row;
            }
        }
    }

    foreach ($promotions as &$p) {
        if (array_key_exists('_sm_resolved_venue_name', $p)) {
            $p['venue_name'] = $p['_sm_resolved_venue_name'];
            unset($p['_sm_resolved_venue_name']);
        }
        if (!empty($p['venue_images']) && $p['venue_images'] !== '[]') {
            $p['venue_images'] = json_decode($p['venue_images']);
        } else {
            $p['venue_images'] = array();
        }
        if (!is_array($p['venue_images'])) {
            $p['venue_images'] = array();
        }

        // 맵으로 보강: 메인 JOIN 이 안 붙어도 동일 DB의 venues 행이 있으면 표시
        $pvid = (int) trim((string) ($p['venue_id'] ?? ''));
        if ($pvid > 0 && isset($venueMap[$pvid])) {
            $vm = $venueMap[$pvid];
            $vname = trim((string) ($vm['name'] ?? ''));
            $cur = trim((string) ($p['venue_name'] ?? ''));
            $looksFallback = ($cur === '' || $cur === '(연결되지 않은 공간)' || preg_match('/^공간 #\d+$/', $cur));
            if ($vname !== '' && $looksFallback) {
                $p['venue_name'] = $vname;
            }
            if (empty(trim((string) ($p['venue_location'] ?? ''))) && !empty(trim((string) ($vm['location'] ?? '')))) {
                $p['venue_location'] = $vm['location'];
            }
            if (empty(trim((string) ($p['venue_type'] ?? ''))) && !empty(trim((string) ($vm['type'] ?? '')))) {
                $p['venue_type'] = $vm['type'];
            }
            if (empty(trim((string) ($p['venue_status'] ?? ''))) && isset($vm['status'])) {
                $p['venue_status'] = $vm['status'];
            }
            if ($hasImages && (empty($p['venue_images']) || !is_array($p['venue_images']) || count($p['venue_images']) === 0)) {
                $rawImg = $vm['images'] ?? null;
                if (!empty($rawImg) && $rawImg !== '[]') {
                    $decoded = json_decode($rawImg);
                    $p['venue_images'] = is_array($decoded) ? $decoded : array();
                }
            }
        }
    }
    unset($p);

    $flags = defined('JSON_INVALID_UTF8_SUBSTITUTE') ? JSON_INVALID_UTF8_SUBSTITUTE : 0;
    echo json_encode(array(
        'success' => true,
        'promotions' => $promotions,
        'venues' => $allVenues
    ), $flags);

} catch (PDOException $e) {
    error_log('[get_admin_promotions] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'DB Error: ' . $e->getMessage()));
}
