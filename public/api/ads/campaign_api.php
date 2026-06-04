<?php
// Campaign Management API — CRUD + stats + assign + share
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

// Admin only
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Auto-create tables
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS ad_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        advertiser VARCHAR(255) NOT NULL DEFAULT '',
        budget DECIMAL(12,2) NULL DEFAULT NULL,
        start_date DATE NULL DEFAULT NULL,
        end_date DATE NULL DEFAULT NULL,
        status ENUM('active','paused','completed') NOT NULL DEFAULT 'active',
        memo TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Add campaign_id to ads table if not exists
    $col = $conn->query("SHOW COLUMNS FROM ads LIKE 'campaign_id'");
    if (!$col->fetch()) {
        $conn->exec("ALTER TABLE ads ADD COLUMN campaign_id INT NULL DEFAULT NULL");
    }

    // campaign share tokens
    $conn->exec("CREATE TABLE IF NOT EXISTS campaign_share_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_campaign (campaign_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $ignore) {
}

// Auto-add target_countries column if missing
try {
    $col = $conn->query("SHOW COLUMNS FROM ad_campaigns LIKE 'target_countries'");
    if (!$col->fetch()) {
        $conn->exec("ALTER TABLE ad_campaigns ADD COLUMN target_countries VARCHAR(500) NOT NULL DEFAULT 'all'");
    }
} catch (PDOException $ignore) {
}

$data = json_decode(file_get_contents('php://input'), true) ?: [];
$action = $data['action'] ?? ($_GET['action'] ?? '');

try {
    switch ($action) {

        // ── LIST campaigns with aggregated stats ──
        case 'list':
            $stmt = $conn->query("
                SELECT c.*,
                    COUNT(a.id) as ad_count,
                    COALESCE(SUM(a.view_count), 0) as total_views,
                    COALESCE(SUM(a.click_count), 0) as total_clicks
                FROM ad_campaigns c
                LEFT JOIN ads a ON a.campaign_id = c.id
                GROUP BY c.id
                ORDER BY c.updated_at DESC
            ");
            $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Also get unassigned ads
            $unStmt = $conn->query("SELECT id, title, slot_id, image_url, view_count, click_count, is_active, start_date, end_date, created_at FROM ads WHERE campaign_id IS NULL ORDER BY created_at DESC");
            $unassigned = $unStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'campaigns' => $campaigns, 'unassigned_ads' => $unassigned]);
            break;

        // ── CREATE campaign ──
        case 'create':
            $name = trim($data['name'] ?? '');
            $advertiser = trim($data['advertiser'] ?? '');
            if (empty($name)) {
                echo json_encode(['success' => false, 'message' => '캠페인명을 입력하세요.']);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO ad_campaigns (name, advertiser, budget, start_date, end_date, status, memo, target_countries) VALUES (:name, :advertiser, :budget, :start_date, :end_date, :status, :memo, :target_countries)");
            $stmt->execute([
                ':name' => $name,
                ':advertiser' => $advertiser,
                ':budget' => $data['budget'] ?? null,
                ':start_date' => $data['start_date'] ?? null,
                ':end_date' => $data['end_date'] ?? null,
                ':status' => $data['status'] ?? 'active',
                ':memo' => $data['memo'] ?? null,
                ':target_countries' => $data['target_countries'] ?? 'all',
            ]);
            echo json_encode(['success' => true, 'id' => $conn->lastInsertId(), 'message' => '캠페인이 생성되었습니다.']);
            break;

        // ── UPDATE campaign ──
        case 'update':
            $id = intval($data['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'id required']);
                exit();
            }
            $stmt = $conn->prepare("UPDATE ad_campaigns SET name=:name, advertiser=:advertiser, budget=:budget, start_date=:start_date, end_date=:end_date, status=:status, memo=:memo, target_countries=:target_countries WHERE id=:id");
            $stmt->execute([
                ':id' => $id,
                ':name' => trim($data['name'] ?? ''),
                ':advertiser' => trim($data['advertiser'] ?? ''),
                ':budget' => $data['budget'] ?? null,
                ':start_date' => $data['start_date'] ?? null,
                ':end_date' => $data['end_date'] ?? null,
                ':status' => $data['status'] ?? 'active',
                ':memo' => $data['memo'] ?? null,
                ':target_countries' => $data['target_countries'] ?? 'all',
            ]);
            echo json_encode(['success' => true, 'message' => '캠페인이 수정되었습니다.']);
            break;

        // ── DELETE campaign (unlink ads, don't delete them) ──
        case 'delete':
            $id = intval($data['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'id required']);
                exit();
            }
            $conn->prepare("UPDATE ads SET campaign_id = NULL WHERE campaign_id = :id")->execute([':id' => $id]);
            $conn->prepare("DELETE FROM ad_campaigns WHERE id = :id")->execute([':id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Campaign deleted.']);
            break;

        // ── ASSIGN / UNASSIGN ads to campaign ──
        case 'assign':
            $campaign_id = isset($data['campaign_id']) ? ($data['campaign_id'] === null ? null : intval($data['campaign_id'])) : null;
            $ad_ids = $data['ad_ids'] ?? [];
            if (empty($ad_ids)) {
                echo json_encode(['success' => false, 'message' => 'ad_ids required']);
                exit();
            }
            $placeholders = implode(',', array_fill(0, count($ad_ids), '?'));
            $stmt = $conn->prepare("UPDATE ads SET campaign_id = ? WHERE id IN ($placeholders)");
            $params = array_merge([$campaign_id], array_map('intval', $ad_ids));
            $stmt->execute($params);
            echo json_encode(['success' => true, 'message' => '광고가 배정되었습니다.']);
            break;

        // ── REPORT — per-campaign aggregated stats ──
        case 'report':
            $id = intval($data['campaign_id'] ?? ($_GET['campaign_id'] ?? 0));
            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'campaign_id required']);
                exit();
            }

            // Campaign info
            $cStmt = $conn->prepare("SELECT * FROM ad_campaigns WHERE id = :id");
            $cStmt->execute([':id' => $id]);
            $campaign = $cStmt->fetch(PDO::FETCH_ASSOC);
            if (!$campaign) {
                echo json_encode(['success' => false, 'message' => 'Campaign not found']);
                exit();
            }

            // Ads in this campaign
            $aStmt = $conn->prepare("SELECT id, title, slot_id, image_url, view_count, click_count, is_active, start_date, end_date FROM ads WHERE campaign_id = :id ORDER BY priority DESC");
            $aStmt->execute([':id' => $id]);
            $campaignAds = $aStmt->fetchAll(PDO::FETCH_ASSOC);

            // Aggregated daily stats
            $adIds = array_column($campaignAds, 'id');
            $daily = [];
            if (!empty($adIds)) {
                try {
                    $ph = implode(',', array_fill(0, count($adIds), '?'));
                    $dStmt = $conn->prepare("SELECT stat_date, SUM(views) as views, SUM(clicks) as clicks FROM ad_daily_stats WHERE ad_id IN ($ph) GROUP BY stat_date ORDER BY stat_date ASC");
                    $dStmt->execute($adIds);
                    $daily = $dStmt->fetchAll(PDO::FETCH_ASSOC);
                } catch (PDOException $ignore) {
                }
            }

            // Summary
            $totalViews = array_sum(array_column($campaignAds, 'view_count'));
            $totalClicks = array_sum(array_column($campaignAds, 'click_count'));
            $ctr = $totalViews > 0 ? round(($totalClicks / $totalViews) * 100, 2) : 0;
            $start = $campaign['start_date'] ?: $campaign['created_at'];
            $end = $campaign['end_date'] ?: date('Y-m-d');
            $days = max(1, (new DateTime($start))->diff(new DateTime($end))->days + 1);

            echo json_encode([
                'success' => true,
                'campaign' => $campaign,
                'ads' => $campaignAds,
                'daily_stats' => $daily,
                'summary' => [
                    'total_views' => $totalViews,
                    'total_clicks' => $totalClicks,
                    'ctr' => $ctr,
                    'running_days' => $days,
                    'avg_daily_views' => round($totalViews / $days, 1),
                    'avg_daily_clicks' => round($totalClicks / $days, 1),
                    'ad_count' => count($campaignAds),
                ]
            ]);
            break;

        // ── SHARE — create/get share token for campaign ──
        case 'share':
            $id = intval($data['campaign_id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'campaign_id required']);
                exit();
            }

            // Check existing valid token
            $existing = $conn->prepare("SELECT token, expires_at FROM campaign_share_tokens WHERE campaign_id = :id AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC LIMIT 1");
            $existing->execute([':id' => $id]);
            $row = $existing->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                echo json_encode(['success' => true, 'token' => $row['token'], 'expires_at' => $row['expires_at'], 'is_new' => false]);
                exit();
            }

            $token = bin2hex(random_bytes(24));
            $expDays = intval($data['expires_days'] ?? 30);
            $expiresAt = $expDays > 0 ? date('Y-m-d H:i:s', strtotime("+{$expDays} days")) : null;

            $stmt = $conn->prepare("INSERT INTO campaign_share_tokens (campaign_id, token, expires_at) VALUES (:cid, :token, :exp)");
            $stmt->execute([':cid' => $id, ':token' => $token, ':exp' => $expiresAt]);

            echo json_encode(['success' => true, 'token' => $token, 'expires_at' => $expiresAt, 'is_new' => true]);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action: ' . $action]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>