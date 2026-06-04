<?php
/**
 * Public Host Profile API (no auth required)
 * Returns host data for the /host-share/:id public share page.
 * Sensitive fields (email, phone, business_no) are NOT included.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../db_connect.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "유효하지 않은 호스트 ID입니다."]);
    exit;
}

try {
    $today = date('Y-m-d');

    // Auto-add optional columns if missing (same as browse_hosts.php)
    $auto_cols = [
        'is_featured'    => 'TINYINT(1) DEFAULT 0',
        'featured_start' => 'DATE DEFAULT NULL',
        'featured_end'   => 'DATE DEFAULT NULL',
        'is_verified'    => 'TINYINT(1) DEFAULT 0',
        'verified_start' => 'DATE DEFAULT NULL',
        'verified_end'   => 'DATE DEFAULT NULL',
    ];
    foreach ($auto_cols as $col => $def) {
        try { $conn->exec("ALTER TABLE users ADD COLUMN {$col} {$def}"); } catch (PDOException $e) {}
    }
    try { $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_deadline DATE DEFAULT NULL"); } catch (PDOException $e) {}
    try { $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_closed TINYINT(1) DEFAULT 0"); } catch (PDOException $e) {}

    // Optional venue columns
    $venue_opt_cols = [];
    foreach (['size', 'description', 'commission_rate', 'pricing_unit'] as $oc) {
        try {
            $chk = $conn->query("SHOW COLUMNS FROM venues LIKE '{$oc}'");
            if ($chk->fetch()) $venue_opt_cols[] = $oc;
        } catch (PDOException $e) {}
    }

    // Main query — single host, no email/phone/business_no
    $stmt = $conn->prepare("
        SELECT u.id, u.name, u.profile_image, u.description,
               u.is_featured, u.featured_start, u.featured_end,
               u.is_verified, u.verified_start, u.verified_end, u.created_at,
               (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id AND v.status = 'approved') as venue_count,
               (SELECT GROUP_CONCAT(DISTINCT v2.location SEPARATOR '||') FROM venues v2 WHERE v2.owner_id = u.id AND v2.status = 'approved') as venue_locations,
               (SELECT GROUP_CONCAT(DISTINCT v3.type SEPARATOR '||') FROM venues v3 WHERE v3.owner_id = u.id AND v3.status = 'approved') as venue_types
        FROM users u
        WHERE u.id = ? AND u.role = 'host' AND u.status = 'active'
        LIMIT 1
    ");
    $stmt->execute([$id]);
    $host = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$host) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "호스트를 찾을 수 없습니다."]);
        exit;
    }

    decode_fields($host, ['name', 'description']);

    // Process is_featured / is_verified (period-based)
    $raw_featured = intval($host['is_featured'] ?? 0);
    $raw_verified = intval($host['is_verified'] ?? 0);

    $host['is_featured'] = ($raw_featured &&
        (!$host['featured_start'] || $host['featured_start'] <= $today) &&
        (!$host['featured_end']   || $host['featured_end']   >= $today)) ? 1 : 0;

    $host['is_verified'] = ($raw_verified &&
        (!$host['verified_start'] || $host['verified_start'] <= $today) &&
        (!$host['verified_end']   || $host['verified_end']   >= $today)) ? 1 : 0;

    unset($host['featured_start'], $host['featured_end'], $host['verified_start'], $host['verified_end']);

    $host['venue_count'] = intval($host['venue_count']);

    // Parse regions
    $locations = [];
    if (!empty($host['venue_locations'])) {
        foreach (explode('||', $host['venue_locations']) as $loc) {
            $loc = trim($loc);
            if (!empty($loc)) {
                $parts  = explode(' ', $loc);
                $region = implode(' ', array_slice($parts, 0, min(2, count($parts))));
                if (!in_array($region, $locations)) $locations[] = $region;
            }
        }
    }
    $host['regions'] = $locations;

    // Parse types
    $types = [];
    if (!empty($host['venue_types'])) {
        $types = array_values(array_filter(explode('||', $host['venue_types'])));
    }
    $host['types'] = $types;

    unset($host['venue_locations'], $host['venue_types']);

    // Venue deadlines
    $deadlineStmt = $conn->prepare("
        SELECT v.name as venue_name, v.recruitment_deadline, v.recruitment_closed
        FROM venues v
        WHERE v.owner_id = ? AND v.status = 'approved'
          AND (v.recruitment_deadline IS NOT NULL OR v.recruitment_closed = 1)
        ORDER BY v.recruitment_deadline ASC
    ");
    $deadlineStmt->execute([$id]);
    $deadlineVenues = $deadlineStmt->fetchAll(PDO::FETCH_ASSOC);

    $host['venue_deadlines'] = [];
    foreach ($deadlineVenues as $dv) {
        $host['venue_deadlines'][] = [
            'venue_name' => $dv['venue_name'],
            'deadline'   => $dv['recruitment_deadline'],
            'closed'     => intval($dv['recruitment_closed']),
        ];
    }

    // Nearest deadline
    $host['nearest_deadline'] = null;
    $host['has_closed'] = false;
    foreach ($deadlineVenues as $dv) {
        if (intval($dv['recruitment_closed'])) {
            $host['has_closed'] = true;
        } elseif ($dv['recruitment_deadline'] && !$host['nearest_deadline']) {
            $host['nearest_deadline'] = $dv['recruitment_deadline'];
        }
    }

    // Venue list
    $venueListCols = "v.id, v.name, v.type, v.location, v.images, v.price";
    foreach ($venue_opt_cols as $oc) {
        $venueListCols .= ", v.{$oc}";
    }
    $venueListStmt = $conn->prepare("
        SELECT {$venueListCols}, v.status
        FROM venues v
        WHERE v.owner_id = ?
        ORDER BY v.status = 'approved' DESC, v.created_at DESC
    ");
    $venueListStmt->execute([$id]);
    $venueList = $venueListStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($venueList as &$v) {
        if (isset($v['images'])) {
            $v['images'] = json_decode($v['images'], true) ?: [];
        }
        $v['is_active'] = ($v['status'] === 'approved') ? 1 : 0;
        unset($v['status']);
    }
    $host['venues'] = $venueList;

    echo json_encode(["success" => true, "host" => $host], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[get_host_public] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "호스트 정보 로드 중 오류가 발생했습니다."]);
}
?>
