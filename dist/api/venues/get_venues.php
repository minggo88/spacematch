<?php
include_once '../db_connect.php';

// Auto-migrate: add max_sellers column if not exists
try {
    $col = $conn->query("SHOW COLUMNS FROM venues LIKE 'max_sellers'");
    if (!$col->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN max_sellers INT DEFAULT 0");
    }
} catch (PDOException $e) { /* ignore */
}

// Auto-migrate: add region column if not exists + backfill from location
try {
    $col = $conn->query("SHOW COLUMNS FROM venues LIKE 'region'");
    if (!$col->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN region VARCHAR(50) DEFAULT '' AFTER location");
        // Backfill region from existing location data
        $region_map = [
            '서울특별시' => '서울특별시',
            '서울' => '서울특별시',
            '경기도' => '경기도',
            '경기' => '경기도',
            '인천광역시' => '인천광역시',
            '인천' => '인천광역시',
            '부산광역시' => '부산광역시',
            '부산' => '부산광역시',
            '대구광역시' => '대구광역시',
            '대구' => '대구광역시',
            '광주광역시' => '광주광역시',
            '광주' => '광주광역시',
            '대전광역시' => '대전광역시',
            '대전' => '대전광역시',
            '울산광역시' => '울산광역시',
            '울산' => '울산광역시',
            '세종특별자치시' => '세종특별자치시',
            '세종' => '세종특별자치시',
            '제주특별자치도' => '제주특별자치도',
            '제주' => '제주특별자치도',
            '강원도' => '강원도',
            '강원' => '강원도',
            '충청북도' => '충청북도',
            '충북' => '충청북도',
            '충청남도' => '충청남도',
            '충남' => '충청남도',
            '전라북도' => '전라북도',
            '전북' => '전라북도',
            '전라남도' => '전라남도',
            '전남' => '전라남도',
            '경상북도' => '경상북도',
            '경북' => '경상북도',
            '경상남도' => '경상남도',
            '경남' => '경상남도'
        ];
        foreach ($region_map as $prefix => $full) {
            $conn->exec("UPDATE venues SET region = '{$full}' WHERE (region IS NULL OR region = '') AND location LIKE '{$prefix}%'");
        }
    }
} catch (PDOException $e) { /* ignore */
}

// Auto-migrate: add is_premium column if not exists
try {
    $col = $conn->query("SHOW COLUMNS FROM venues LIKE 'is_premium'");
    if (!$col->fetch()) {
        $conn->exec("ALTER TABLE venues ADD COLUMN is_premium TINYINT(1) DEFAULT 0");
    }
} catch (PDOException $e) { /* ignore */
}

function deep_decode($str) {
    if (!is_string($str)) return $str;
    $prev = null;
    while ($prev !== $str) {
        $prev = $str;
        $str = html_entity_decode($str, ENT_QUOTES, 'UTF-8');
    }
    return $str;
}

function decode_venue_fields(&$venue) {
    foreach (['name', 'description', 'location', 'type', 'size', 'region', 'avg_sales'] as $field) {
        if (isset($venue[$field])) $venue[$field] = deep_decode($venue[$field]);
    }
}

$id = isset($_GET['id']) ? $_GET['id'] : null;

if ($id) {
    $query = "SELECT v.*, 
              u.name as owner_name, u.country as owner_country,
              (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count
              FROM venues v
              LEFT JOIN users u ON v.owner_id = u.id
              WHERE v.id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Decode images JSON
    if ($result && $result['images']) {
        $result['images'] = json_decode($result['images']);
    }
    if ($result) decode_venue_fields($result);

    echo json_encode($result);
} else {
    // Only show approved venues in the public market
    $query = "SELECT v.*, 
              u.name as owner_name, u.country as owner_country,
              (SELECT COUNT(*) FROM applications a WHERE a.venue_id = v.id AND a.status = 'approved') as approved_count
              FROM venues v
              LEFT JOIN users u ON v.owner_id = u.id
              WHERE v.status = 'approved' ORDER BY v.is_premium DESC, v.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode images JSON for each venue
    foreach ($results as &$venue) {
        if ($venue['images']) {
            $venue['images'] = json_decode($venue['images']);
        } else {
            $venue['images'] = [];
        }
        decode_venue_fields($venue);
    }

    echo json_encode($results);
}
?>