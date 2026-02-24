<?php
/**
 * Space Match 마케팅 API — 광고 관리
 * 
 * 벤더 광고 캠페인, 스폰서 리스팅, 배너 관리 엔드포인트
 * 
 * 엔드포인트:
 *   GET    /api/marketing/ads/campaigns     — 광고 캠페인 목록
 *   POST   /api/marketing/ads/campaigns     — 광고 캠페인 생성
 *   GET    /api/marketing/ads/sponsored     — 스폰서 리스팅 목록
 *   POST   /api/marketing/ads/sponsored     — 스폰서 리스팅 생성
 *   GET    /api/marketing/ads/banners       — 배너 목록
 *   POST   /api/marketing/ads/banners       — 배너 생성
 *   GET    /api/marketing/ads/metrics       — 광고 성과 지표
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../public/api/db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$segments = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$resource = $segments[3] ?? 'campaigns';

try {
    switch ("$method:$resource") {
        case 'GET:campaigns':
            getAdCampaigns($pdo);
            break;
        case 'POST:campaigns':
            createAdCampaign($pdo);
            break;
        case 'GET:sponsored':
            getSponsoredListings($pdo);
            break;
        case 'POST:sponsored':
            createSponsoredListing($pdo);
            break;
        case 'GET:banners':
            getBanners($pdo);
            break;
        case 'POST:banners':
            createBanner($pdo);
            break;
        case 'GET:metrics':
            getAdMetrics($pdo);
            break;
        default:
            jsonResponse(['error' => 'Endpoint not found'], 404);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

// ── 광고 캠페인 목록 ──
function getAdCampaigns($pdo)
{
    $vendorId = $_GET['vendor_id'] ?? null;
    $status = $_GET['status'] ?? null;

    $where = ['1=1'];
    $params = [];
    if ($vendorId) {
        $where[] = 'vendor_id = ?';
        $params[] = $vendorId;
    }
    if ($status) {
        $where[] = 'status = ?';
        $params[] = $status;
    }

    $stmt = $pdo->prepare("SELECT * FROM marketing_ad_campaigns WHERE " . implode(' AND ', $where) . " ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 광고 캠페인 생성 ──
function createAdCampaign($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $id = 'ad_' . time() . '_' . substr(md5(uniqid()), 0, 4);

    $stmt = $pdo->prepare("INSERT INTO marketing_ad_campaigns (id, vendor_id, name, objective, placements, budget_daily, budget_total, schedule_start, schedule_end, targeting, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', NOW())");

    $stmt->execute([
        $id,
        $data['vendor_id'] ?? null,
        $data['name'] ?? '광고 캠페인',
        $data['objective'] ?? 'awareness',
        json_encode($data['placements'] ?? ['search_top']),
        $data['budget_daily'] ?? 50000,
        $data['budget_total'] ?? null,
        $data['schedule_start'] ?? date('Y-m-d'),
        $data['schedule_end'] ?? date('Y-m-d', strtotime('+30 days')),
        json_encode($data['targeting'] ?? []),
    ]);

    jsonResponse(['success' => true, 'id' => $id], 201);
}

// ── 스폰서 리스팅 목록 ──
function getSponsoredListings($pdo)
{
    $status = $_GET['status'] ?? 'active';
    $stmt = $pdo->prepare("SELECT * FROM marketing_sponsored_listings WHERE status = ? ORDER BY plan DESC, created_at DESC LIMIT 50");
    $stmt->execute([$status]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 스폰서 리스팅 생성 ──
function createSponsoredListing($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $id = 'spl_' . time();

    $plans = ['basic' => 30000, 'standard' => 70000, 'premium' => 150000];
    $plan = $data['plan'] ?? 'basic';
    $price = $plans[$plan] ?? 30000;

    $duration = $data['duration'] ?? ($plan === 'premium' ? 30 : ($plan === 'standard' ? 14 : 7));
    $endDate = date('Y-m-d', strtotime("+{$duration} days"));

    $stmt = $pdo->prepare("INSERT INTO marketing_sponsored_listings (id, vendor_id, vendor_name, plan, price, keywords, categories, start_date, end_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())");

    $stmt->execute([
        $id,
        $data['vendor_id'] ?? null,
        $data['vendor_name'] ?? '',
        $plan,
        $price,
        json_encode($data['keywords'] ?? []),
        json_encode($data['categories'] ?? []),
        date('Y-m-d'),
        $endDate,
    ]);

    jsonResponse(['success' => true, 'id' => $id, 'plan' => $plan, 'price' => $price, 'end_date' => $endDate], 201);
}

// ── 배너 목록 ──
function getBanners($pdo)
{
    $slotId = $_GET['slot'] ?? null;
    $where = $slotId ? 'WHERE slot_id = ?' : '';
    $params = $slotId ? [$slotId] : [];

    $stmt = $pdo->prepare("SELECT * FROM marketing_banners $where ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 배너 생성 ──
function createBanner($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $id = 'bnr_' . time() . '_' . substr(md5(uniqid()), 0, 4);

    $stmt = $pdo->prepare("INSERT INTO marketing_banners (id, vendor_id, name, slot_id, image_url, headline, cta_text, link_url, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())");

    $stmt->execute([
        $id,
        $data['vendor_id'] ?? null,
        $data['name'] ?? '배너 광고',
        $data['slot_id'] ?? 'inline',
        $data['image_url'] ?? '',
        $data['headline'] ?? '',
        $data['cta_text'] ?? '자세히 보기',
        $data['link_url'] ?? '',
    ]);

    jsonResponse(['success' => true, 'id' => $id], 201);
}

// ── 광고 성과 지표 ──
function getAdMetrics($pdo)
{
    $vendorId = $_GET['vendor_id'] ?? null;
    $where = $vendorId ? 'WHERE vendor_id = ?' : '';
    $params = $vendorId ? [$vendorId] : [];

    $stmt = $pdo->prepare("SELECT 
        COUNT(*) as total_campaigns,
        COALESCE(SUM(impressions), 0) as total_impressions,
        COALESCE(SUM(clicks), 0) as total_clicks,
        COALESCE(SUM(conversions), 0) as total_conversions,
        COALESCE(SUM(spend), 0) as total_spend
        FROM marketing_ad_campaigns $where");
    $stmt->execute($params);
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);

    $metrics['ctr'] = $metrics['total_impressions'] > 0
        ? round($metrics['total_clicks'] / $metrics['total_impressions'] * 100, 2)
        : 0;
    $metrics['cvr'] = $metrics['total_clicks'] > 0
        ? round($metrics['total_conversions'] / $metrics['total_clicks'] * 100, 2)
        : 0;
    $metrics['cpc'] = $metrics['total_clicks'] > 0
        ? round($metrics['total_spend'] / $metrics['total_clicks'])
        : 0;

    jsonResponse(['success' => true, 'data' => $metrics]);
}

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
