<?php
/**
 * Space Match 마케팅 API — 프로모션 관리
 * 
 * 쿠폰, 타임세일, 번들딜 등 프로모션 관련 엔드포인트
 * 
 * 엔드포인트:
 *   GET    /api/marketing/promotions            — 프로모션 목록
 *   POST   /api/marketing/promotions/coupons    — 쿠폰 생성
 *   POST   /api/marketing/promotions/validate   — 쿠폰 유효성 검증
 *   GET    /api/marketing/promotions/flash-sales — 진행중 타임세일
 *   POST   /api/marketing/promotions/flash-sales — 타임세일 생성
 *   GET    /api/marketing/promotions/bundles     — 번들딜 목록
 *   POST   /api/marketing/promotions/bundles     — 번들딜 생성
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
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));
$resource = $segments[3] ?? 'list';

try {
    switch ("$method:$resource") {
        case 'GET:list':
        case 'GET:promotions':
            getPromotions($pdo);
            break;

        // ── 쿠폰 ──
        case 'POST:coupons':
            createCoupon($pdo);
            break;
        case 'POST:validate':
            validateCoupon($pdo);
            break;
        case 'GET:coupons':
            getCoupons($pdo);
            break;

        // ── 타임세일 ──
        case 'GET:flash-sales':
            getFlashSales($pdo);
            break;
        case 'POST:flash-sales':
            createFlashSale($pdo);
            break;

        // ── 번들 ──
        case 'GET:bundles':
            getBundles($pdo);
            break;
        case 'POST:bundles':
            createBundle($pdo);
            break;

        default:
            jsonResponse(['error' => 'Endpoint not found'], 404);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

// ── 프로모션 전체 목록 ──
function getPromotions($pdo)
{
    $ownerId = $_GET['owner_id'] ?? null;
    $status = $_GET['status'] ?? null;

    $promotions = [];

    // 쿠폰
    $where = ['1=1'];
    $params = [];
    if ($ownerId) {
        $where[] = 'owner_id = ?';
        $params[] = $ownerId;
    }
    if ($status) {
        $where[] = 'status = ?';
        $params[] = $status;
    }

    $stmt = $pdo->prepare("SELECT *, 'coupon' as promo_type FROM marketing_coupons WHERE " . implode(' AND ', $where) . " ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    $promotions = array_merge($promotions, $stmt->fetchAll(PDO::FETCH_ASSOC));

    // 타임세일
    $stmt = $pdo->prepare("SELECT *, 'flash_sale' as promo_type FROM marketing_flash_sales WHERE " . implode(' AND ', $where) . " ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    $promotions = array_merge($promotions, $stmt->fetchAll(PDO::FETCH_ASSOC));

    jsonResponse(['success' => true, 'data' => $promotions, 'total' => count($promotions)]);
}

// ── 쿠폰 생성 ──
function createCoupon($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);

    $code = $data['code'] ?? generateCouponCode();
    $id = 'cpn_' . time() . '_' . substr(md5(uniqid()), 0, 4);

    $stmt = $pdo->prepare("INSERT INTO marketing_coupons (id, code, owner_id, type, discount_value, min_purchase, max_discount, usage_limit, valid_from, valid_until, categories, countries, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())");

    $stmt->execute([
        $id,
        $code,
        $data['owner_id'] ?? null,
        $data['type'] ?? 'percentage',
        $data['discount_value'] ?? 0,
        $data['min_purchase'] ?? 0,
        $data['max_discount'] ?? null,
        $data['usage_limit'] ?? null,
        $data['valid_from'] ?? date('Y-m-d'),
        $data['valid_until'] ?? date('Y-m-d', strtotime('+30 days')),
        json_encode($data['categories'] ?? []),
        json_encode($data['countries'] ?? []),
    ]);

    jsonResponse(['success' => true, 'id' => $id, 'code' => $code, 'message' => '쿠폰이 생성되었습니다'], 201);
}

function generateCouponCode($length = 8)
{
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = 'SM-';
    for ($i = 0; $i < $length; $i++)
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    return $code;
}

// ── 쿠폰 유효성 검증 ──
function validateCoupon($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $code = $data['code'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM marketing_coupons WHERE code = ? AND status = 'active'");
    $stmt->execute([$code]);
    $coupon = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$coupon) {
        jsonResponse(['valid' => false, 'error' => '유효하지 않은 쿠폰입니다']);
        return;
    }

    $now = date('Y-m-d');
    if ($coupon['valid_from'] > $now || $coupon['valid_until'] < $now) {
        jsonResponse(['valid' => false, 'error' => '쿠폰 유효기간이 아닙니다']);
        return;
    }

    jsonResponse(['valid' => true, 'coupon' => $coupon]);
}

// ── 쿠폰 목록 ──
function getCoupons($pdo)
{
    $ownerId = $_GET['owner_id'] ?? null;
    $params = $ownerId ? [$ownerId] : [];
    $where = $ownerId ? 'WHERE owner_id = ?' : '';

    $stmt = $pdo->prepare("SELECT * FROM marketing_coupons $where ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 타임세일 목록 ──
function getFlashSales($pdo)
{
    $status = $_GET['status'] ?? 'active';
    $stmt = $pdo->prepare("SELECT * FROM marketing_flash_sales WHERE status = ? ORDER BY start_time ASC LIMIT 20");
    $stmt->execute([$status]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 타임세일 생성 ──
function createFlashSale($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $id = 'fs_' . time();

    $stmt = $pdo->prepare("INSERT INTO marketing_flash_sales (id, owner_id, name, type, discount_percent, start_time, end_time, stock_limit, per_user_limit, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())");

    $stmt->execute([
        $id,
        $data['owner_id'] ?? null,
        $data['name'] ?? '타임세일',
        $data['type'] ?? 'time_limited',
        $data['discount_percent'] ?? 20,
        $data['start_time'] ?? date('Y-m-d H:i:s'),
        $data['end_time'] ?? date('Y-m-d H:i:s', strtotime('+2 hours')),
        $data['stock_limit'] ?? null,
        $data['per_user_limit'] ?? 1,
    ]);

    jsonResponse(['success' => true, 'id' => $id], 201);
}

// ── 번들딜 목록 ──
function getBundles($pdo)
{
    $ownerId = $_GET['owner_id'] ?? null;
    $params = $ownerId ? [$ownerId] : [];
    $where = $ownerId ? 'WHERE owner_id = ?' : '';

    $stmt = $pdo->prepare("SELECT * FROM marketing_bundles $where ORDER BY created_at DESC LIMIT 50");
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

// ── 번들딜 생성 ──
function createBundle($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $id = 'bdl_' . time();

    $stmt = $pdo->prepare("INSERT INTO marketing_bundles (id, owner_id, name, type, items, discount_percent, valid_until, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW())");

    $stmt->execute([
        $id,
        $data['owner_id'] ?? null,
        $data['name'] ?? '번들딜',
        $data['type'] ?? 'fixed_set',
        json_encode($data['items'] ?? []),
        $data['discount_percent'] ?? 10,
        $data['valid_until'] ?? date('Y-m-d', strtotime('+30 days')),
    ]);

    jsonResponse(['success' => true, 'id' => $id], 201);
}

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
