<?php
/**
 * set_promotion.php
 * 관리자 전용: 베뉴를 특정 tier로 승격/이동하고 기간 설정
 * POST: { venue_id, tier, featured_category?, start_date, end_date, admin_note?, display_order? }
 */
include_once '../db_connect.php';
session_start();

// Admin only
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin privileges required.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$venue_id = intval($data['venue_id'] ?? 0);
$tier = $data['tier'] ?? '';
$featured_category = $data['featured_category'] ?? null;
$start_date = $data['start_date'] ?? '';
$end_date = $data['end_date'] ?? '';
$admin_note = $data['admin_note'] ?? null;
$display_order = intval($data['display_order'] ?? 0);
$admin_id = $_SESSION['user_id'];

// Validation
$validTiers = ['hot_top', 'hot_mid', 'category_featured'];
if (!$venue_id || !in_array($tier, $validTiers) || !$start_date || !$end_date) {
    echo json_encode(['success' => false, 'message' => '필수 항목을 모두 입력해 주세요. (venue_id, tier, start_date, end_date)']);
    exit;
}

if ($tier === 'category_featured' && empty($featured_category)) {
    echo json_encode(['success' => false, 'message' => '카테고리를 선택해 주세요.']);
    exit;
}

if (strtotime($end_date) < strtotime($start_date)) {
    echo json_encode(['success' => false, 'message' => '종료일은 시작일 이후여야 합니다.']);
    exit;
}

try {
    // Auto-create table if needed
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

    // Check if venue exists
    $checkStmt = $conn->prepare("SELECT id FROM venues WHERE id = ?");
    $checkStmt->execute([$venue_id]);
    if (!$checkStmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Venue not found.']);
        exit;
    }

    // For category_featured, allow multiple promotions per venue (different categories)
    // For hot_top/hot_mid, keep the existing one-per-venue rule
    if ($tier === 'category_featured') {
        $existStmt = $conn->prepare("SELECT id FROM venue_promotions WHERE venue_id = ? AND tier = 'category_featured' AND featured_category = ?");
        $existStmt->execute([$venue_id, $featured_category]);
    } else {
        $existStmt = $conn->prepare("SELECT id FROM venue_promotions WHERE venue_id = ? AND tier IN ('hot_top', 'hot_mid')");
        $existStmt->execute([$venue_id]);
    }
    $existing = $existStmt->fetch(PDO::FETCH_ASSOC);

    // Clear featured_category for non-category tiers
    if ($tier !== 'category_featured') {
        $featured_category = null;
    }

    if ($existing) {
        // Update existing
        $updateStmt = $conn->prepare("UPDATE venue_promotions 
            SET tier = ?, featured_category = ?, start_date = ?, end_date = ?, admin_note = ?, display_order = ?, created_by = ?
            WHERE id = ?");
        $updateStmt->execute([$tier, $featured_category, $start_date, $end_date, $admin_note, $display_order, $admin_id, $existing['id']]);
        echo json_encode(['success' => true, 'message' => '프로모션이 업데이트되었습니다.', 'action' => 'updated']);
    } else {
        // Insert new
        $insertStmt = $conn->prepare("INSERT INTO venue_promotions 
            (venue_id, tier, featured_category, start_date, end_date, admin_note, display_order, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $insertStmt->execute([$venue_id, $tier, $featured_category, $start_date, $end_date, $admin_note, $display_order, $admin_id]);
        echo json_encode(['success' => true, 'message' => '프로모션이 등록되었습니다.', 'action' => 'created']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>