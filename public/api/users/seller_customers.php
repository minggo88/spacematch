<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + seller/host role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if (!in_array($role, ['seller', 'host'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "셀러/호스트만 이용 가능합니다."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? 'list';

// ── Auto-migration: ensure tables exist ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        company VARCHAR(200) DEFAULT NULL,
        tags VARCHAR(500) DEFAULT NULL,
        memo TEXT DEFAULT NULL,
        status ENUM('active','inactive','vip','lead') DEFAULT 'active',
        source VARCHAR(100) DEFAULT NULL,
        first_purchase_date DATE DEFAULT NULL,
        last_purchase_date DATE DEFAULT NULL,
        total_revenue BIGINT DEFAULT 0,
        total_purchases INT DEFAULT 0,
        avg_satisfaction DECIMAL(3,1) DEFAULT NULL,
        country_code VARCHAR(2) DEFAULT 'KR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_status (user_id, status),
        INDEX idx_name (user_id, name),
        INDEX idx_country (user_id, country_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    $conn->exec("CREATE TABLE IF NOT EXISTS seller_customer_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        customer_id INT NOT NULL,
        activity_type ENUM('note','call','meeting','email','purchase','other') DEFAULT 'note',
        title VARCHAR(300) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        activity_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_customer (customer_id),
        INDEX idx_user (user_id),
        INDEX idx_date (customer_id, activity_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add missing columns for existing tables
    $existingCols = [];
    $cols = $conn->query("SHOW COLUMNS FROM seller_customers");
    while ($col = $cols->fetch(PDO::FETCH_ASSOC)) {
        $existingCols[] = $col['Field'];
    }
    $needed = [
        'source' => "VARCHAR(100) DEFAULT NULL",
        'country_code' => "VARCHAR(2) DEFAULT 'KR'",
        'avg_satisfaction' => "DECIMAL(3,1) DEFAULT NULL",
    ];
    foreach ($needed as $col => $def) {
        if (!in_array($col, $existingCols)) {
            $conn->exec("ALTER TABLE seller_customers ADD COLUMN $col $def");
        }
    }
} catch (Exception $e) { /* ignore migration errors */
}

switch ($action) {
    // ── LIST: Get all customers ──
    case 'list':
        $countryCode = $_GET['country_code'] ?? 'KR';
        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? '';
        $sortBy = $_GET['sort'] ?? 'updated_at';
        $sortDir = strtoupper($_GET['dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = max(1, min(100, intval($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $allowedSorts = ['name', 'email', 'total_revenue', 'total_purchases', 'last_purchase_date', 'created_at', 'updated_at', 'status'];
        if (!in_array($sortBy, $allowedSorts))
            $sortBy = 'updated_at';

        $where = "user_id = :uid AND country_code = :cc";
        $params = [':uid' => $userId, ':cc' => $countryCode];

        if ($search) {
            $where .= " AND (name LIKE :search OR email LIKE :search2 OR phone LIKE :search3 OR company LIKE :search4 OR tags LIKE :search5)";
            $params[':search'] = "%$search%";
            $params[':search2'] = "%$search%";
            $params[':search3'] = "%$search%";
            $params[':search4'] = "%$search%";
            $params[':search5'] = "%$search%";
        }
        if ($status) {
            $where .= " AND status = :status";
            $params[':status'] = $status;
        }

        // Count
        $countStmt = $conn->prepare("SELECT COUNT(*) FROM seller_customers WHERE $where");
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        // Data
        $stmt = $conn->prepare("SELECT * FROM seller_customers WHERE $where ORDER BY $sortBy $sortDir LIMIT $limit OFFSET $offset");
        $stmt->execute($params);
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Summary stats
        $summStmt = $conn->prepare("SELECT 
            COUNT(*) as total_count,
            SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active_count,
            SUM(CASE WHEN status='vip' THEN 1 ELSE 0 END) as vip_count,
            SUM(CASE WHEN status='lead' THEN 1 ELSE 0 END) as lead_count,
            SUM(CASE WHEN status='inactive' THEN 1 ELSE 0 END) as inactive_count,
            COALESCE(SUM(total_revenue), 0) as sum_revenue,
            COALESCE(AVG(total_revenue), 0) as avg_revenue
        FROM seller_customers WHERE user_id = :uid AND country_code = :cc");
        $summStmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $summary = $summStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "customers" => $customers,
            "total" => intval($total),
            "page" => $page,
            "limit" => $limit,
            "summary" => $summary,
        ]);
        break;

    // ── SAVE: Create or Update customer ──
    case 'save':
        $id = intval($input['id'] ?? 0);
        $name = trim($input['name'] ?? '');
        if (!$name) {
            echo json_encode(["success" => false, "message" => "고객 이름은 필수입니다."]);
            exit;
        }

        $data = [
            'name' => $name,
            'email' => trim($input['email'] ?? '') ?: null,
            'phone' => trim($input['phone'] ?? '') ?: null,
            'company' => trim($input['company'] ?? '') ?: null,
            'tags' => trim($input['tags'] ?? '') ?: null,
            'memo' => trim($input['memo'] ?? '') ?: null,
            'status' => in_array($input['status'] ?? '', ['active', 'inactive', 'vip', 'lead']) ? $input['status'] : 'active',
            'source' => trim($input['source'] ?? '') ?: null,
            'country_code' => $input['country_code'] ?? 'KR',
        ];

        if ($id > 0) {
            // Verify ownership
            $check = $conn->prepare("SELECT id FROM seller_customers WHERE id = :id AND user_id = :uid");
            $check->execute([':id' => $id, ':uid' => $userId]);
            if (!$check->fetch()) {
                echo json_encode(["success" => false, "message" => "권한이 없습니다."]);
                exit;
            }

            $sets = [];
            $params = [':id' => $id];
            foreach ($data as $col => $val) {
                $sets[] = "$col = :$col";
                $params[":$col"] = $val;
            }
            $sql = "UPDATE seller_customers SET " . implode(', ', $sets) . " WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
        } else {
            $data['user_id'] = $userId;
            $cols = array_keys($data);
            $placeholders = array_map(fn($c) => ":$c", $cols);
            $sql = "INSERT INTO seller_customers (" . implode(',', $cols) . ") VALUES (" . implode(',', $placeholders) . ")";
            $stmt = $conn->prepare($sql);
            foreach ($data as $col => $val) {
                $stmt->bindValue(":$col", $val);
            }
            $stmt->execute();
            $id = $conn->lastInsertId();
        }

        echo json_encode(["success" => true, "id" => $id]);
        break;

    // ── DELETE: Remove customer ──
    case 'delete':
        $id = intval($input['id'] ?? 0);
        $check = $conn->prepare("SELECT id FROM seller_customers WHERE id = :id AND user_id = :uid");
        $check->execute([':id' => $id, ':uid' => $userId]);
        if (!$check->fetch()) {
            echo json_encode(["success" => false, "message" => "고객을 찾을 수 없습니다."]);
            exit;
        }
        // Delete activities too
        $conn->prepare("DELETE FROM seller_customer_activities WHERE customer_id = :cid AND user_id = :uid")->execute([':cid' => $id, ':uid' => $userId]);
        $conn->prepare("DELETE FROM seller_customers WHERE id = :id AND user_id = :uid")->execute([':id' => $id, ':uid' => $userId]);
        echo json_encode(["success" => true]);
        break;

    // ── ACTIVITIES: List customer activities ──
    case 'activities':
        $customerId = intval($_GET['customer_id'] ?? 0);
        $stmt = $conn->prepare("SELECT * FROM seller_customer_activities WHERE customer_id = :cid AND user_id = :uid ORDER BY activity_date DESC LIMIT 50");
        $stmt->execute([':cid' => $customerId, ':uid' => $userId]);
        echo json_encode(["success" => true, "activities" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

    // ── ADD_ACTIVITY: Add customer activity ──
    case 'add_activity':
        $customerId = intval($input['customer_id'] ?? 0);
        $activityType = in_array($input['activity_type'] ?? '', ['note', 'call', 'meeting', 'email', 'purchase', 'other']) ? $input['activity_type'] : 'note';
        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $actDate = $input['activity_date'] ?? date('Y-m-d H:i:s');

        // Verify customer ownership
        $check = $conn->prepare("SELECT id FROM seller_customers WHERE id = :id AND user_id = :uid");
        $check->execute([':id' => $customerId, ':uid' => $userId]);
        if (!$check->fetch()) {
            echo json_encode(["success" => false, "message" => "고객을 찾을 수 없습니다."]);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO seller_customer_activities (user_id, customer_id, activity_type, title, description, activity_date) VALUES (:uid, :cid, :type, :title, :desc, :date)");
        $stmt->execute([
            ':uid' => $userId,
            ':cid' => $customerId,
            ':type' => $activityType,
            ':title' => $title,
            ':desc' => $description,
            ':date' => $actDate,
        ]);

        echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
        break;

    // ── DELETE_ACTIVITY ──
    case 'delete_activity':
        $actId = intval($input['id'] ?? 0);
        $conn->prepare("DELETE FROM seller_customer_activities WHERE id = :id AND user_id = :uid")->execute([':id' => $actId, ':uid' => $userId]);
        echo json_encode(["success" => true]);
        break;

    // ── LINK_SALES: Link sales records to customer & update totals ──
    case 'link_sales':
        $customerId = intval($input['customer_id'] ?? 0);
        // Recalculate customer totals from linked sales
        $check = $conn->prepare("SELECT id FROM seller_customers WHERE id = :id AND user_id = :uid");
        $check->execute([':id' => $customerId, ':uid' => $userId]);
        if (!$check->fetch()) {
            echo json_encode(["success" => false, "message" => "고객을 찾을 수 없습니다."]);
            exit;
        }

        $totalRevenue = intval($input['total_revenue'] ?? 0);
        $totalPurchases = intval($input['total_purchases'] ?? 0);
        $lastPurchaseDate = $input['last_purchase_date'] ?? null;
        $firstPurchaseDate = $input['first_purchase_date'] ?? null;

        $stmt = $conn->prepare("UPDATE seller_customers SET total_revenue = :rev, total_purchases = :purch, last_purchase_date = :lpd, first_purchase_date = COALESCE(:fpd, first_purchase_date) WHERE id = :id");
        $stmt->execute([
            ':rev' => $totalRevenue,
            ':purch' => $totalPurchases,
            ':lpd' => $lastPurchaseDate,
            ':fpd' => $firstPurchaseDate,
            ':id' => $customerId,
        ]);

        echo json_encode(["success" => true]);
        break;

    // ── STATS: Customer summary statistics ──
    case 'stats':
        $countryCode = $_GET['country_code'] ?? 'KR';
        $stmt = $conn->prepare("SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status='vip' THEN 1 ELSE 0 END) as vip,
            SUM(CASE WHEN status='lead' THEN 1 ELSE 0 END) as leads,
            SUM(CASE WHEN status='inactive' THEN 1 ELSE 0 END) as inactive,
            COALESCE(SUM(total_revenue), 0) as total_revenue,
            COALESCE(AVG(total_revenue), 0) as avg_revenue,
            COALESCE(AVG(avg_satisfaction), 0) as avg_satisfaction,
            COUNT(CASE WHEN last_purchase_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent_active
        FROM seller_customers WHERE user_id = :uid AND country_code = :cc");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "stats" => $stats]);
        break;

    // ── RFM_ANALYSIS: Customer segmentation using RFM scoring ──
    case 'rfm_analysis':
        $countryCode = $_GET['country_code'] ?? $input['country_code'] ?? 'KR';

        // Get all customers with purchase data
        $stmt = $conn->prepare("SELECT id, name, email, phone, company, status, tags,
            total_revenue, total_purchases, last_purchase_date, first_purchase_date,
            avg_satisfaction, created_at
            FROM seller_customers WHERE user_id = :uid AND country_code = :cc");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($customers)) {
            echo json_encode(["success" => true, "segments" => [], "customers" => [], "summary" => []]);
            break;
        }

        $now = new DateTime();
        $rfmData = [];

        foreach ($customers as $c) {
            // R: days since last purchase (lower = better)
            $lastPurchase = $c['last_purchase_date'] ? new DateTime($c['last_purchase_date']) : null;
            $recencyDays = $lastPurchase ? $now->diff($lastPurchase)->days : 999;

            // F: total number of purchases
            $frequency = intval($c['total_purchases'] ?? 0);

            // M: total revenue
            $monetary = intval($c['total_revenue'] ?? 0);

            $rfmData[] = [
                'customer' => $c,
                'recency_days' => $recencyDays,
                'frequency' => $frequency,
                'monetary' => $monetary,
            ];
        }

        // Calculate percentile-based scores (1-5, 5=best)
        // Sort and assign scores based on quintiles
        $count = count($rfmData);

        // Recency scores (lower days = higher score)
        usort($rfmData, fn($a, $b) => $a['recency_days'] - $b['recency_days']);
        foreach ($rfmData as $i => &$r) {
            $r['r_score'] = 5 - intval(($i / max($count, 1)) * 5);
            $r['r_score'] = max(1, min(5, $r['r_score']));
        }
        unset($r);

        // Frequency scores (higher = better)
        usort($rfmData, fn($a, $b) => $b['frequency'] - $a['frequency']);
        foreach ($rfmData as $i => &$r) {
            $r['f_score'] = 5 - intval(($i / max($count, 1)) * 5);
            $r['f_score'] = max(1, min(5, $r['f_score']));
        }
        unset($r);

        // Monetary scores (higher = better)
        usort($rfmData, fn($a, $b) => $b['monetary'] - $a['monetary']);
        foreach ($rfmData as $i => &$r) {
            $r['m_score'] = 5 - intval(($i / max($count, 1)) * 5);
            $r['m_score'] = max(1, min(5, $r['m_score']));
        }
        unset($r);

        // Assign segments
        $segments = [
            'vip' => ['label' => 'VIP', 'count' => 0, 'revenue' => 0, 'customers' => []],
            'excellent' => ['label' => '우수 고객', 'count' => 0, 'revenue' => 0, 'customers' => []],
            'normal' => ['label' => '일반 고객', 'count' => 0, 'revenue' => 0, 'customers' => []],
            'attention' => ['label' => '관심 필요', 'count' => 0, 'revenue' => 0, 'customers' => []],
            'churn_risk' => ['label' => '이탈 위험', 'count' => 0, 'revenue' => 0, 'customers' => []],
        ];

        foreach ($rfmData as &$r) {
            $total = $r['r_score'] + $r['f_score'] + $r['m_score'];
            $r['rfm_total'] = $total;

            if ($total >= 13) {
                $r['segment'] = 'vip';
            } elseif ($total >= 10) {
                $r['segment'] = 'excellent';
            } elseif ($total >= 7) {
                $r['segment'] = 'normal';
            } elseif ($total >= 4) {
                $r['segment'] = 'attention';
            } else {
                $r['segment'] = 'churn_risk';
            }

            $segments[$r['segment']]['count']++;
            $segments[$r['segment']]['revenue'] += $r['monetary'];

            // Build customer result
            $r['customer']['rfm_total'] = $total;
            $r['customer']['r_score'] = $r['r_score'];
            $r['customer']['f_score'] = $r['f_score'];
            $r['customer']['m_score'] = $r['m_score'];
            $r['customer']['segment'] = $r['segment'];
            $r['customer']['recency_days'] = $r['recency_days'];

            $segments[$r['segment']]['customers'][] = $r['customer'];
        }
        unset($r);

        // Sort by RFM total desc
        usort($rfmData, fn($a, $b) => $b['rfm_total'] - $a['rfm_total']);

        // Flatten customer list sorted by RFM
        $sortedCustomers = array_map(fn($r) => $r['customer'], $rfmData);

        // Summary stats
        $totalRevAll = array_sum(array_column($rfmData, 'monetary'));
        foreach ($segments as $key => &$seg) {
            $seg['revenue_pct'] = $totalRevAll > 0 ? round(($seg['revenue'] / $totalRevAll) * 100, 1) : 0;
            $seg['count_pct'] = $count > 0 ? round(($seg['count'] / $count) * 100, 1) : 0;
            // Remove customer details from segment summary (too large)
            unset($seg['customers']);
        }
        unset($seg);

        echo json_encode([
            "success" => true,
            "segments" => $segments,
            "customers" => $sortedCustomers,
            "total_customers" => $count,
            "total_revenue" => $totalRevAll,
        ]);
        break;

    // ── CRM_ALERTS: Generate smart CRM alerts from customer data ──
    case 'crm_alerts':
        $countryCode = $_GET['country_code'] ?? $input['country_code'] ?? 'KR';
        $alerts = [];

        // 1. Churn risk: customers who haven't purchased in 90+ days
        $stmt = $conn->prepare("SELECT id, name, email, company, total_revenue, total_purchases, last_purchase_date, status
            FROM seller_customers WHERE user_id = :uid AND country_code = :cc
            AND last_purchase_date IS NOT NULL
            AND last_purchase_date < DATE_SUB(NOW(), INTERVAL 90 DAY)
            AND status != 'inactive'
            ORDER BY total_revenue DESC LIMIT 10");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $churnRisk = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($churnRisk as $c) {
            $days = (new DateTime())->diff(new DateTime($c['last_purchase_date']))->days;
            $alerts[] = [
                'type' => 'churn_risk',
                'priority' => 'high',
                'icon' => '🚨',
                'title' => "{$c['name']}님 이탈 위험",
                'message' => "{$days}일간 미구매. 총 매출 " . number_format($c['total_revenue']) . "원",
                'customer_id' => $c['id'],
                'customer_name' => $c['name'],
                'days_inactive' => $days,
                'revenue_at_risk' => intval($c['total_revenue']),
            ];
        }

        // 2. VIP follow-up: VIP customers not purchased in 30+ days
        $stmt = $conn->prepare("SELECT id, name, email, company, total_revenue, last_purchase_date
            FROM seller_customers WHERE user_id = :uid AND country_code = :cc
            AND status = 'vip'
            AND last_purchase_date IS NOT NULL
            AND last_purchase_date < DATE_SUB(NOW(), INTERVAL 30 DAY)
            ORDER BY total_revenue DESC LIMIT 5");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $vipFollowup = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($vipFollowup as $c) {
            $days = (new DateTime())->diff(new DateTime($c['last_purchase_date']))->days;
            $alerts[] = [
                'type' => 'vip_followup',
                'priority' => 'medium',
                'icon' => '👑',
                'title' => "VIP {$c['name']}님 재방문 필요",
                'message' => "{$days}일전 마지막 구매. 맞춤 프로모션을 제안해보세요.",
                'customer_id' => $c['id'],
                'customer_name' => $c['name'],
                'days_inactive' => $days,
            ];
        }

        // 3. New leads without activity (registered 7+ days ago, no purchases)
        $stmt = $conn->prepare("SELECT id, name, email, company, created_at
            FROM seller_customers WHERE user_id = :uid AND country_code = :cc
            AND status = 'lead'
            AND (total_purchases IS NULL OR total_purchases = 0)
            AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY created_at DESC LIMIT 5");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $coldLeads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($coldLeads as $c) {
            $days = (new DateTime())->diff(new DateTime($c['created_at']))->days;
            $alerts[] = [
                'type' => 'cold_lead',
                'priority' => 'low',
                'icon' => '📋',
                'title' => "{$c['name']}님 리드 전환 필요",
                'message' => "등록 후 {$days}일 경과. 첫 구매 유도가 필요합니다.",
                'customer_id' => $c['id'],
                'customer_name' => $c['name'],
                'days_since_register' => $days,
            ];
        }

        // 4. Summary stats for alert context
        $stmt = $conn->prepare("SELECT COUNT(*) total,
            SUM(CASE WHEN last_purchase_date < DATE_SUB(NOW(), INTERVAL 90 DAY) AND status != 'inactive' THEN 1 ELSE 0 END) as at_risk,
            SUM(CASE WHEN status = 'vip' THEN 1 ELSE 0 END) as vip_count,
            SUM(CASE WHEN status = 'active' AND last_purchase_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as active_recent
            FROM seller_customers WHERE user_id = :uid AND country_code = :cc AND last_purchase_date IS NOT NULL");
        $stmt->execute([':uid' => $userId, ':cc' => $countryCode]);
        $summary = $stmt->fetch(PDO::FETCH_ASSOC);

        // Sort alerts by priority
        usort($alerts, function ($a, $b) {
            $order = ['high' => 0, 'medium' => 1, 'low' => 2];
            return ($order[$a['priority']] ?? 3) - ($order[$b['priority']] ?? 3);
        });

        echo json_encode([
            "success" => true,
            "alerts" => $alerts,
            "alert_count" => count($alerts),
            "summary" => $summary,
        ]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
}
