<?php
/**
 * get_trending.php
 * 급상승 공간 API — 인기 기반 알고리즘
 *
 * 점수 = (좋아요 수 × 3) + (입점 신청 수 × 5) + (최신 등록 보너스)
 *
 * - 좋아요(찜) 수: venue_wishlist 테이블에서 집계
 * - 입점 신청 수: applications 테이블에서 집계
 * - 최신 등록 보너스: 최근 7일 이내 등록된 베뉴에 +10점
 *
 * 핫한 플레이스(프로모션 등록)에 이미 포함된 베뉴는 제외
 * 상위 8개 반환
 */
include_once '../db_connect.php';

try {
    // Auto-create wishlist table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS venue_wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        venue_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wish (user_id, venue_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Detect application column name (some installs use seller_id, some use user_id)
    $appCol = 'user_id';
    try {
        $colCheck = $conn->query("SHOW COLUMNS FROM applications LIKE 'seller_id'");
        if ($colCheck && $colCheck->rowCount() > 0)
            $appCol = 'seller_id';
    } catch (Exception $e) {
        // applications table might not exist
    }

    // Get currently promoted venue IDs (to exclude from trending)
    $promotedIds = [];
    try {
        $promoStmt = $conn->query("SELECT DISTINCT venue_id FROM venue_promotions WHERE end_date >= CURDATE()");
        $promotedIds = $promoStmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        // venue_promotions might not exist
    }

    $excludeClause = '';
    if (!empty($promotedIds)) {
        $placeholders = implode(',', array_map('intval', $promotedIds));
        $excludeClause = "AND v.id NOT IN ($placeholders)";
    }

    // Main query: compute trending score
    $query = "
        SELECT 
            v.*,
            u.country as owner_country,
            COALESCE(wc.wish_count, 0) AS wish_count,
            COALESCE(ac.app_count, 0) AS app_count,
            (
                COALESCE(wc.wish_count, 0) * 3 +
                COALESCE(ac.app_count, 0) * 5 +
                CASE WHEN v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 10 ELSE 0 END
            ) AS trending_score
        FROM venues v
        LEFT JOIN users u ON v.owner_id = u.id
        LEFT JOIN (
            SELECT venue_id, COUNT(*) AS wish_count 
            FROM venue_wishlist 
            GROUP BY venue_id
        ) wc ON wc.venue_id = v.id
        LEFT JOIN (
            SELECT venue_id, COUNT(*) AS app_count 
            FROM applications 
            GROUP BY venue_id
        ) ac ON ac.venue_id = v.id
        WHERE v.status = 'approved'
        $excludeClause
        ORDER BY trending_score DESC, v.created_at DESC
        LIMIT 8
    ";

    $stmt = $conn->query($query);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse images JSON
    foreach ($results as &$row) {
        if (!empty($row['images'])) {
            $decoded = json_decode($row['images'], true);
            if (is_array($decoded)) {
                $row['images'] = $decoded;
            } else {
                $row['images'] = [$row['images']];
            }
        } else {
            $row['images'] = [];
        }
    }

    echo json_encode([
        "success" => true,
        "trending" => $results
    ]);
} catch (Exception $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.', "trending" => []]);
}
?>