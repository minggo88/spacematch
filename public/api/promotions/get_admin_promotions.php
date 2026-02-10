<?php
/**
 * get_admin_promotions.php
 * 관리자 전용: 모든 프로모션 관리 데이터 (만료 포함)
 */
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => '관리자 권한이 필요합니다.']);
    exit;
}

try {
    // Auto-create table
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

    $today = date('Y-m-d');

    // All promotions with venue info
    $query = "SELECT 
                vp.*, 
                v.name as venue_name, v.location as venue_location, v.type as venue_type,
                v.images as venue_images, v.status as venue_status,
                u.name as admin_name,
                CASE WHEN vp.end_date >= ? THEN 'active' ELSE 'expired' END as promo_status
              FROM venue_promotions vp
              JOIN venues v ON vp.venue_id = v.id
              LEFT JOIN users u ON vp.created_by = u.id
              ORDER BY vp.tier ASC, vp.display_order ASC, vp.end_date DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([$today]);
    $promotions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($promotions as &$p) {
        if ($p['venue_images']) {
            $p['venue_images'] = json_decode($p['venue_images']);
        } else {
            $p['venue_images'] = [];
        }
    }

    // Also get all approved venues for the selector dropdown
    $venuesStmt = $conn->prepare("SELECT id, name, location, type FROM venues WHERE status = 'approved' ORDER BY name ASC");
    $venuesStmt->execute();
    $allVenues = $venuesStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'promotions' => $promotions,
        'venues' => $allVenues
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>