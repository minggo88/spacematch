<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// Any logged-in user can browse vendors (sellers primarily)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["error" => "로그인이 필요합니다."]);
    exit;
}

try {
    // Ensure is_featured column exists
    try {
        $conn->exec("ALTER TABLE users ADD COLUMN is_featured TINYINT(1) DEFAULT 0");
    } catch (PDOException $e) { /* column already exists */
    }

    // Ensure recruitment_deadline and recruitment_closed columns exist in venues
    try {
        $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_deadline DATE DEFAULT NULL");
    } catch (PDOException $e) { /* column already exists */
    }
    try {
        $conn->exec("ALTER TABLE venues ADD COLUMN recruitment_closed TINYINT(1) DEFAULT 0");
    } catch (PDOException $e) { /* column already exists */
    }

    // Get all active vendors with their venue stats
    $query = "SELECT 
                u.id, u.name, u.email, u.phone, u.business_no, u.is_featured, u.created_at,
                (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id AND v.status = 'approved') as venue_count,
                (SELECT GROUP_CONCAT(DISTINCT v2.location SEPARATOR '||') FROM venues v2 WHERE v2.owner_id = u.id AND v2.status = 'approved') as venue_locations,
                (SELECT GROUP_CONCAT(DISTINCT v3.type SEPARATOR '||') FROM venues v3 WHERE v3.owner_id = u.id AND v3.status = 'approved') as venue_types
              FROM users u 
              WHERE u.role = 'vendor' AND u.status = 'active'
              ORDER BY u.is_featured DESC, u.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get venue deadlines per vendor
    $deadlineStmt = $conn->prepare("SELECT v.name as venue_name, v.recruitment_deadline, v.recruitment_closed FROM venues v WHERE v.owner_id = ? AND v.status = 'approved' AND (v.recruitment_deadline IS NOT NULL OR v.recruitment_closed = 1) ORDER BY v.recruitment_deadline ASC");

    // Get individual venue list per vendor — dynamically check available columns
    $venueListCols = "v.id, v.name, v.type, v.location, v.images, v.price";
    try {
        $chk = $conn->query("SHOW COLUMNS FROM venues LIKE 'size'");
        if ($chk->fetch())
            $venueListCols .= ", v.size";
    } catch (PDOException $e) {
    }
    try {
        $chk2 = $conn->query("SHOW COLUMNS FROM venues LIKE 'description'");
        if ($chk2->fetch())
            $venueListCols .= ", v.description";
    } catch (PDOException $e) {
    }
    try {
        $chk3 = $conn->query("SHOW COLUMNS FROM venues LIKE 'commission_rate'");
        if ($chk3->fetch())
            $venueListCols .= ", v.commission_rate";
    } catch (PDOException $e) {
    }
    try {
        $chk4 = $conn->query("SHOW COLUMNS FROM venues LIKE 'pricing_unit'");
        if ($chk4->fetch())
            $venueListCols .= ", v.pricing_unit";
    } catch (PDOException $e) {
    }
    $venueListStmt = $conn->prepare("SELECT {$venueListCols} FROM venues v WHERE v.owner_id = ? AND v.status = 'approved' ORDER BY v.created_at DESC");

    // Process location strings to extract city/district
    foreach ($vendors as &$vendor) {
        $vendor['venue_count'] = intval($vendor['venue_count']);
        $vendor['is_featured'] = intval($vendor['is_featured'] ?? 0);

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

    echo json_encode($vendors);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error: " . $e->getMessage()]);
}
?>