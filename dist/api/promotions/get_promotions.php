<?php
/**
 * get_promotions.php
 * 공개 API: 모집 대시보드용 프로모션 데이터 반환
 * - hot_top: 핫 정보 모집 (최상단)
 * - hot_mid: 핫한 모집 정보 (중간)
 * - category_featured: 카테고리별 상위 노출
 * - all: 전체 모집 정보 (하단)
 */
include_once '../db_connect.php';

try {
    // Auto-create venue_promotions table if it doesn't exist
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

    // Migrate ENUM to VARCHAR if needed
    try {
        $conn->exec("ALTER TABLE venue_promotions MODIFY COLUMN tier VARCHAR(30) NOT NULL DEFAULT 'hot_top'");
    } catch (PDOException $e) { /* already migrated */
    }

    // Ensure featured_category column exists
    try {
        $conn->exec("ALTER TABLE venue_promotions ADD COLUMN featured_category VARCHAR(50) DEFAULT NULL AFTER tier");
    } catch (PDOException $e) { /* column already exists */
    }

    // Dynamically detect available venue columns to prevent 500 errors
    $venueColStmt = $conn->query("SHOW COLUMNS FROM venues");
    $venueCols = $venueColStmt->fetchAll(PDO::FETCH_COLUMN, 0);

    $baseVenueCols = "v.id as venue_id, v.name, v.location, v.description, v.type, v.price, v.images, v.status";
    if (in_array('size', $venueCols))
        $baseVenueCols .= ", v.size";
    if (in_array('commission_rate', $venueCols))
        $baseVenueCols .= ", v.commission_rate";
    if (in_array('recruitment_deadline', $venueCols))
        $baseVenueCols .= ", v.recruitment_deadline";
    if (in_array('recruitment_closed', $venueCols))
        $baseVenueCols .= ", v.recruitment_closed";

    $today = date('Y-m-d');

    // Get active promotions with venue data
    $promoQuery = "SELECT 
                    vp.id as promotion_id, vp.tier, vp.featured_category,
                    vp.start_date, vp.end_date, 
                    vp.admin_note, vp.display_order,
                    {$baseVenueCols},
                    u.name as owner_name, u.email as owner_email, u.phone as owner_phone
                   FROM venue_promotions vp
                   JOIN venues v ON vp.venue_id = v.id
                   LEFT JOIN users u ON v.owner_id = u.id
                   WHERE vp.start_date <= ?
                     AND vp.end_date >= ?
                   ORDER BY vp.tier ASC, vp.display_order ASC, vp.created_at DESC";

    $stmt = $conn->prepare($promoQuery);
    $stmt->execute([$today, $today]);
    $promoResults = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $hotTop = [];
    $hotMid = [];
    $categoryFeatured = [];
    $promotedVenueIds = [];

    foreach ($promoResults as &$row) {
        if (!empty($row['images'])) {
            $row['images'] = json_decode($row['images']);
        } else {
            $row['images'] = [];
        }
        $row['commission_rate'] = floatval($row['commission_rate'] ?? 0);
        $row['recruitment_closed'] = intval($row['recruitment_closed'] ?? 0);

        $promotedVenueIds[] = intval($row['venue_id']);

        if ($row['tier'] === 'hot_top') {
            $hotTop[] = $row;
        } elseif ($row['tier'] === 'hot_mid') {
            $hotMid[] = $row;
        } elseif ($row['tier'] === 'category_featured') {
            $cat = $row['featured_category'] ?: ($row['type'] ?? 'etc');
            if (!isset($categoryFeatured[$cat])) {
                $categoryFeatured[$cat] = [];
            }
            $categoryFeatured[$cat][] = $row;
        }
    }

    // Get all approved venues not in promotions
    $allQuery = "SELECT 
                    {$baseVenueCols},
                    u.name as owner_name, u.email as owner_email, u.phone as owner_phone
                 FROM venues v
                 LEFT JOIN users u ON v.owner_id = u.id
                 WHERE v.status = 'approved'
                 ORDER BY v.created_at DESC";

    $stmt2 = $conn->prepare($allQuery);
    $stmt2->execute();
    $allVenues = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    $allList = [];
    foreach ($allVenues as &$venue) {
        if (in_array(intval($venue['venue_id']), $promotedVenueIds)) {
            continue;
        }
        if (!empty($venue['images'])) {
            $venue['images'] = json_decode($venue['images']);
        } else {
            $venue['images'] = [];
        }
        $venue['commission_rate'] = floatval($venue['commission_rate'] ?? 0);
        $venue['recruitment_closed'] = intval($venue['recruitment_closed'] ?? 0);
        $allList[] = $venue;
    }

    echo json_encode([
        'success' => true,
        'hot_top' => $hotTop,
        'hot_mid' => $hotMid,
        'category_featured' => $categoryFeatured,
        'all' => $allList
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>