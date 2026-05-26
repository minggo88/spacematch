<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Any logged-in user can browse hosts (sellers primarily)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["error" => "로그인이 필요합니다."]);
    exit;
}

try {
    // Ensure featured/verified columns exist (once per session)
    if (empty($_SESSION['_ddl_browse_hosts'])) {
        $auto_cols = [
            'is_featured'   => 'TINYINT(1) DEFAULT 0',
            'featured_start' => 'DATE DEFAULT NULL',
            'featured_end'   => 'DATE DEFAULT NULL',
            'is_verified'    => 'TINYINT(1) DEFAULT 0',
            'verified_start' => 'DATE DEFAULT NULL',
            'verified_end'   => 'DATE DEFAULT NULL',
            'profile_image'  => 'VARCHAR(255) DEFAULT NULL',
            'description'    => 'TEXT DEFAULT NULL'
        ];
        foreach ($auto_cols as $col => $def) {
            try {
                $conn->exec("ALTER TABLE users ADD COLUMN {$col} {$def}");
            } catch (PDOException $e) {
            }
        }

        // Ensure recruitment_deadline and recruitment_closed columns exist in venues
        try {
            $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_deadline DATE DEFAULT NULL");
        } catch (PDOException $e) {
        }
        try {
            $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_closed TINYINT(1) DEFAULT 0");
        } catch (PDOException $e) {
        }

        // Dynamically check available venue columns
        $venue_opt_cols = [];
        foreach (['size', 'description', 'commission_rate', 'pricing_unit', 'event_periods'] as $oc) {
            try {
                $chk = $conn->query("SHOW COLUMNS FROM venues LIKE '{$oc}'");
                if ($chk->fetch())
                    $venue_opt_cols[] = $oc;
            } catch (PDOException $e) {
            }
        }
        $_SESSION['_ddl_browse_hosts'] = true;
        $_SESSION['_browse_hosts_venue_cols'] = $venue_opt_cols;
    }

    $today = date('Y-m-d');

    // Get all active hosts with parameterized date
    $query = "SELECT
                u.id, u.name, u.email, u.phone, u.business_no, u.profile_image, u.description, u.is_featured, u.featured_start, u.featured_end, u.is_verified, u.verified_start, u.verified_end, u.created_at,
                (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id AND v.status = 'approved') as venue_count,
                (SELECT GROUP_CONCAT(DISTINCT v2.location SEPARATOR '||') FROM venues v2 WHERE v2.owner_id = u.id AND v2.status = 'approved') as venue_locations,
                (SELECT GROUP_CONCAT(DISTINCT v3.type SEPARATOR '||') FROM venues v3 WHERE v3.owner_id = u.id AND v3.status = 'approved') as venue_types
              FROM users u
              WHERE u.role = 'host' AND u.status = 'active'
              ORDER BY (CASE WHEN u.is_featured = 1 AND (u.featured_start IS NULL OR u.featured_start <= :today1) AND (u.featured_end IS NULL OR u.featured_end >= :today2) THEN 1 ELSE 0 END) DESC, u.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([':today1' => $today, ':today2' => $today]);
    $hosts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get venue deadlines per vendor
    $deadlineStmt = $conn->prepare("SELECT v.name as venue_name, v.recruitment_deadline, v.recruitment_closed FROM venues v WHERE v.owner_id = ? AND v.status = 'approved' AND (v.recruitment_deadline IS NOT NULL OR v.recruitment_closed = 1) ORDER BY v.recruitment_deadline ASC");

    // Build venue column list from session cache
    $venueListCols = "v.id, v.name, v.type, v.location, v.images, v.price";
    foreach ($_SESSION['_browse_hosts_venue_cols'] ?? [] as $oc) {
        $venueListCols .= ", v.{$oc}";
    }
    $venueListStmt = $conn->prepare("SELECT {$venueListCols}, v.status FROM venues v WHERE v.owner_id = ? ORDER BY v.status = 'approved' DESC, v.created_at DESC");

    // Process location strings to extract city/district
    $today = date('Y-m-d');
    foreach ($hosts as &$vendor) {
        $vendor['venue_count'] = intval($vendor['venue_count']);
        // optional 컬럼 fallback
        if (!isset($vendor['profile_image'])) $vendor['profile_image'] = null;
        if (!isset($vendor['description']))   $vendor['description'] = '';

        // Apply period-based checks
        $raw_featured = intval($vendor['is_featured'] ?? 0);
        $raw_verified = intval($vendor['is_verified'] ?? 0);

        $featured_active = $raw_featured &&
            (!$vendor['featured_start'] || $vendor['featured_start'] <= $today) &&
            (!$vendor['featured_end'] || $vendor['featured_end'] >= $today);
        $verified_active = $raw_verified &&
            (!$vendor['verified_start'] || $vendor['verified_start'] <= $today) &&
            (!$vendor['verified_end'] || $vendor['verified_end'] >= $today);

        $vendor['is_featured'] = $featured_active ? 1 : 0;
        $vendor['is_verified'] = $verified_active ? 1 : 0;

        // Parse locations into array
        $locations = [];
        if (!empty($vendor['venue_locations'])) {
            $rawLocations = explode('||', $vendor['venue_locations']);
            foreach ($rawLocations as $loc) {
                $loc = trim($loc);
                if (!empty($loc)) {
                    // Extract city/district (first 2 words of Korean address)
                    $parts = explode(' ', $loc);
                    $region = implode(' ', array_slice($parts, 0, min(2, count($parts))));
                    if (!in_array($region, $locations)) {
                        $locations[] = $region;
                    }
                }
            }
        }
        $vendor['regions'] = $locations;

        // Parse types into array
        $types = [];
        if (!empty($vendor['venue_types'])) {
            $types = array_filter(explode('||', $vendor['venue_types']));
        }
        $vendor['types'] = $types;

        // Get venue deadlines for this vendor
        $deadlineStmt->execute([$vendor['id']]);
        $deadlineVenues = $deadlineStmt->fetchAll(PDO::FETCH_ASSOC);
        $vendor['venue_deadlines'] = [];
        foreach ($deadlineVenues as $dv) {
            $vendor['venue_deadlines'][] = [
                'venue_name' => $dv['venue_name'],
                'deadline' => $dv['recruitment_deadline'],
                'closed' => intval($dv['recruitment_closed'])
            ];
        }

        // Get venue list for this vendor
        $venueListStmt->execute([$vendor['id']]);
        $venueList = $venueListStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($venueList as &$v) {
            if (isset($v['images'])) {
                $v['images'] = json_decode($v['images'], true) ?: [];
            }
            $v['is_active'] = ($v['status'] === 'approved') ? 1 : 0;
            unset($v['status']);
        }
        $vendor['venues'] = $venueList;

        // Nearest deadline across all venues
        $vendor['nearest_deadline'] = null;
        $vendor['has_closed'] = false;
        foreach ($deadlineVenues as $dv) {
            if (intval($dv['recruitment_closed'])) {
                $vendor['has_closed'] = true;
            } elseif ($dv['recruitment_deadline'] && !$vendor['nearest_deadline']) {
                $vendor['nearest_deadline'] = $dv['recruitment_deadline'];
            }
        }

        // Remove raw concat strings
        unset($vendor['venue_locations']);
        unset($vendor['venue_types']);
    }

    echo json_encode($hosts);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[browse_hosts] ' . $e->getMessage());
    echo json_encode(["error" => "호스트 목록 로드 중 오류가 발생했습니다."]);
}
?>