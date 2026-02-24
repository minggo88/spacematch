<?php
/**
 * Space Match 마케팅 API — 캠페인 관리
 * 
 * 통합 마케팅 캠페인 CRUD 및 상태 관리 엔드포인트
 * 
 * 엔드포인트:
 *   GET    /api/marketing/campaigns         — 캠페인 목록 조회
 *   GET    /api/marketing/campaigns/{id}    — 캠페인 상세 조회
 *   POST   /api/marketing/campaigns         — 캠페인 생성
 *   PUT    /api/marketing/campaigns/{id}    — 캠페인 수정
 *   PATCH  /api/marketing/campaigns/{id}/status — 상태 변경
 *   DELETE /api/marketing/campaigns/{id}    — 캠페인 삭제
 *   GET    /api/marketing/campaigns/stats   — 캠페인 통계
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── DB 연결 ──
require_once __DIR__ . '/../../public/api/db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', trim($path, '/'));

try {
    // 라우팅
    $action = isset($segments[3]) ? $segments[3] : 'list';

    switch ($method) {
        case 'GET':
            if ($action === 'stats') {
                getCampaignStats($pdo);
            } elseif ($action !== 'list' && $action !== 'campaigns') {
                getCampaign($pdo, $action);
            } else {
                getCampaigns($pdo);
            }
            break;
        case 'POST':
            createCampaign($pdo);
            break;
        case 'PUT':
            updateCampaign($pdo, $action);
            break;
        case 'PATCH':
            updateCampaignStatus($pdo, $action);
            break;
        case 'DELETE':
            deleteCampaign($pdo, $action);
            break;
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}

// ── 캠페인 목록 조회 ──
function getCampaigns($pdo)
{
    $status = $_GET['status'] ?? null;
    $side = $_GET['side'] ?? null;       // seller | vendor
    $type = $_GET['type'] ?? null;
    $ownerId = $_GET['owner_id'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $where = ['1=1'];
    $params = [];

    if ($status) {
        $where[] = 'status = ?';
        $params[] = $status;
    }
    if ($side) {
        $where[] = 'side = ?';
        $params[] = $side;
    }
    if ($type) {
        $where[] = 'type = ?';
        $params[] = $type;
    }
    if ($ownerId) {
        $where[] = 'owner_id = ?';
        $params[] = $ownerId;
    }

    $whereClause = implode(' AND ', $where);

    // 전체 수
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM marketing_campaigns WHERE $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();

    // 데이터
    $stmt = $pdo->prepare("SELECT * FROM marketing_campaigns WHERE $whereClause ORDER BY created_at DESC LIMIT ? OFFSET ?");
    $allParams = array_merge($params, [$limit, $offset]);
    $stmt->execute($allParams);
    $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse([
        'success' => true,
        'data' => $campaigns,
        'pagination' => ['page' => $page, 'limit' => $limit, 'total' => intval($total), 'totalPages' => ceil($total / $limit)],
    ]);
}

// ── 캠페인 상세 조회 ──
function getCampaign($pdo, $id)
{
    $stmt = $pdo->prepare("SELECT * FROM marketing_campaigns WHERE id = ?");
    $stmt->execute([$id]);
    $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign)
        jsonResponse(['error' => '캠페인을 찾을 수 없습니다'], 404);
    jsonResponse(['success' => true, 'data' => $campaign]);
}

// ── 캠페인 생성 ──
function createCampaign($pdo)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['name']))
        jsonResponse(['error' => '캠페인 이름은 필수입니다'], 400);

    $id = 'cmp_' . time() . '_' . substr(md5(uniqid()), 0, 6);

    $stmt = $pdo->prepare("INSERT INTO marketing_campaigns (id, name, type, side, owner_id, description, status, budget_total, budget_daily, schedule_start, schedule_end, targeting, settings, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, NOW(), NOW())");

    $stmt->execute([
        $id,
        $data['name'],
        $data['type'] ?? 'general',
        $data['side'] ?? 'seller',
        $data['owner_id'] ?? null,
        $data['description'] ?? '',
        $data['budget']['total'] ?? 0,
        $data['budget']['daily'] ?? 0,
        $data['schedule']['start_date'] ?? null,
        $data['schedule']['end_date'] ?? null,
        json_encode($data['targeting'] ?? []),
        json_encode($data['settings'] ?? []),
    ]);

    jsonResponse(['success' => true, 'id' => $id, 'message' => '캠페인이 생성되었습니다'], 201);
}

// ── 캠페인 수정 ──
function updateCampaign($pdo, $id)
{
    $data = json_decode(file_get_contents('php://input'), true);

    $fields = [];
    $params = [];
    $allowed = ['name', 'description', 'type', 'budget_total', 'budget_daily', 'schedule_start', 'schedule_end'];

    foreach ($allowed as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $params[] = $data[$field];
        }
    }
    if (isset($data['targeting'])) {
        $fields[] = 'targeting = ?';
        $params[] = json_encode($data['targeting']);
    }
    if (isset($data['settings'])) {
        $fields[] = 'settings = ?';
        $params[] = json_encode($data['settings']);
    }

    $fields[] = 'updated_at = NOW()';
    $params[] = $id;

    $stmt = $pdo->prepare("UPDATE marketing_campaigns SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);

    jsonResponse(['success' => true, 'message' => '캠페인이 수정되었습니다']);
}

// ── 상태 변경 ──
function updateCampaignStatus($pdo, $id)
{
    $data = json_decode(file_get_contents('php://input'), true);
    $newStatus = $data['status'] ?? null;

    if (!$newStatus)
        jsonResponse(['error' => '새 상태가 필요합니다'], 400);

    $validStates = ['draft', 'review', 'approved', 'scheduled', 'active', 'paused', 'completed', 'cancelled', 'archived'];
    if (!in_array($newStatus, $validStates))
        jsonResponse(['error' => '유효하지 않은 상태입니다'], 400);

    $stmt = $pdo->prepare("UPDATE marketing_campaigns SET status = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$newStatus, $id]);

    jsonResponse(['success' => true, 'message' => "상태가 '{$newStatus}'로 변경되었습니다"]);
}

// ── 캠페인 삭제 ──
function deleteCampaign($pdo, $id)
{
    $stmt = $pdo->prepare("DELETE FROM marketing_campaigns WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => '캠페인이 삭제되었습니다']);
}

// ── 캠페인 통계 ──
function getCampaignStats($pdo)
{
    $ownerId = $_GET['owner_id'] ?? null;
    $where = $ownerId ? 'WHERE owner_id = ?' : '';
    $params = $ownerId ? [$ownerId] : [];

    $stmt = $pdo->prepare("SELECT status, COUNT(*) as count, SUM(budget_total) as total_budget FROM marketing_campaigns $where GROUP BY status");
    $stmt->execute($params);
    $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    jsonResponse(['success' => true, 'data' => $stats]);
}

// ── JSON 응답 헬퍼 ──
function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
