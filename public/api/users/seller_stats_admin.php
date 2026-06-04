<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + admin/superadmin role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';
if (!in_array($role, ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "관리자만 이용 가능합니다."]);
    exit;
}

$action = $_GET['action'] ?? 'overview';
$countryFilter = trim($_GET['country_code'] ?? 'ALL');

// ── Auto-create seller_stats table if missing ──
try {
    $conn->query("SELECT 1 FROM seller_stats LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        country_code VARCHAR(2) NOT NULL DEFAULT 'KR',
        record_type VARCHAR(20) DEFAULT 'monthly',
        record_date VARCHAR(20) DEFAULT '',
        monthly_revenue DECIMAL(15,2) DEFAULT 0,
        customer_count BIGINT DEFAULT 0,
        transaction_count BIGINT DEFAULT 0,
        avg_unit_price DECIMAL(15,2) DEFAULT 0,
        best_selling_item VARCHAR(255) DEFAULT '',
        venue_type VARCHAR(50) DEFAULT NULL,
        region VARCHAR(100) DEFAULT '',
        region_detail VARCHAR(500) DEFAULT NULL,
        satisfaction DECIMAL(3,1) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_record_type (record_type),
        INDEX idx_record_date (record_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

// ── Auto-migrate: add country_code to seller_stats if missing (once per session) ──
if (empty($_SESSION['seller_stats_admin_migrated'])) {
    try {
        $conn->query("SELECT country_code FROM seller_stats LIMIT 1");
    } catch (PDOException $ex) {
        $conn->exec("ALTER TABLE seller_stats ADD COLUMN country_code VARCHAR(2) NOT NULL DEFAULT 'KR' AFTER user_id");
    }
    $_SESSION['seller_stats_admin_migrated'] = true;
}

// ── Ensure vendor_stats table exists ──
try {
    $conn->query("SELECT 1 FROM vendor_stats LIMIT 1");
    $hasHostStats = true;
} catch (PDOException $e) {
    $hasHostStats = false;
}

// ── Helper: Build the combined CTE (UNION ALL of both tables) ──
// We pick the common columns that both tables share for stats aggregation
function buildCombinedCTE($hasHostStats)
{
    $sellerPart = "SELECT user_id, COALESCE(country_code, 'KR') as country_code, record_type, record_date,
                          monthly_revenue, customer_count, transaction_count, avg_unit_price,
                          best_selling_item, venue_type, region, satisfaction, updated_at,
                          'seller' as data_source
                   FROM seller_stats";

    if (!$hasHostStats) {
        return "($sellerPart)";
    }

    $vendorPart = "SELECT user_id, COALESCE(country_code, 'KR') as country_code, record_type, record_date,
                          monthly_revenue, customer_count, transaction_count, avg_unit_price,
                          best_selling_item, venue_type, region, satisfaction, updated_at,
                          'host' as data_source
                   FROM vendor_stats";

    return "($sellerPart UNION ALL $vendorPart)";
}

// Country filter WHERE clause helper
function countryWhere($alias, $countryFilter)
{
    if ($countryFilter === 'ALL' || $countryFilter === '') {
        return "1=1";
    }
    return "$alias.country_code = " . quote($countryFilter);
}

function quote($val)
{
    global $conn;
    return $conn->quote($val);
}

try {
    $combined = buildCombinedCTE($hasHostStats);
    $cWhere = ($countryFilter === 'ALL' || $countryFilter === '') ? "1=1" : "c.country_code = " . quote($countryFilter);

    switch ($action) {

        // ── OVERVIEW: Dashboard summary across all sellers + hosts ──
        case 'overview':

            // Available countries (from both tables)
            $countrySql = "SELECT DISTINCT country_code FROM (
                SELECT COALESCE(country_code, 'KR') as country_code FROM seller_stats";
            if ($hasHostStats) {
                $countrySql .= " UNION SELECT COALESCE(country_code, 'KR') as country_code FROM vendor_stats";
            }
            $countrySql .= ") AS cc WHERE country_code IS NOT NULL AND country_code != '' ORDER BY country_code";
            $availableCountries = $conn->query($countrySql)->fetchAll(PDO::FETCH_COLUMN);

            // Total unique users with stats
            $sellerCount = $conn->query("
                SELECT COUNT(DISTINCT c.user_id) FROM $combined AS c WHERE $cWhere
            ")->fetchColumn();

            // Per record_type summary
            $typeSummary = $conn->query("
                SELECT c.record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(c.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(c.customer_count), 0) as total_customers,
                       COALESCE(SUM(c.transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(c.avg_unit_price, 0)), 0) as avg_unit_price,
                       MAX(c.updated_at) as last_updated
                FROM $combined AS c
                WHERE $cWhere
                GROUP BY c.record_type
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Top sellers/hosts by total revenue
            $topSellers = $conn->query("
                SELECT c.user_id,
                       u.name, u.brand_name, u.category, u.email,
                       COUNT(*) as record_count,
                       COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(c.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(c.customer_count), 0) as total_customers,
                       COALESCE(SUM(c.transaction_count), 0) as total_transactions,
                       MAX(c.record_date) as latest_record,
                       MAX(c.updated_at) as last_updated
                FROM $combined AS c
                JOIN users u ON c.user_id = u.id
                WHERE $cWhere
                GROUP BY c.user_id
                ORDER BY total_revenue DESC
                LIMIT 20
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Monthly trend (last 12 months)
            $monthlyTrend = $conn->query("
                SELECT CASE 
                    WHEN c.record_type = 'daily' THEN LEFT(c.record_date, 7)
                    WHEN c.record_type = 'monthly' THEN c.record_date
                    WHEN c.record_type = 'annual' THEN c.record_date
                    ELSE c.record_date
                END as period,
                SUM(c.monthly_revenue) as total_revenue,
                COUNT(DISTINCT c.user_id) as seller_count,
                AVG(NULLIF(c.monthly_revenue, 0)) as avg_revenue
                FROM $combined AS c
                WHERE c.record_type = 'monthly' AND $cWhere
                GROUP BY period
                ORDER BY period DESC
                LIMIT 12
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Category distribution
            $categoryDist = $conn->query("
                SELECT COALESCE(c.best_selling_item, '미지정') as category,
                       COUNT(*) as count,
                       SUM(c.monthly_revenue) as total_revenue,
                       COUNT(DISTINCT c.user_id) as seller_count
                FROM $combined AS c
                WHERE c.best_selling_item IS NOT NULL AND c.best_selling_item != '' AND $cWhere
                GROUP BY category
                ORDER BY total_revenue DESC
                LIMIT 15
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Region distribution
            $regionDist = $conn->query("
                SELECT COALESCE(c.region, '미지정') as region,
                       COUNT(*) as count,
                       SUM(c.monthly_revenue) as total_revenue,
                       COUNT(DISTINCT c.user_id) as seller_count
                FROM $combined AS c
                WHERE c.region IS NOT NULL AND c.region != '' AND $cWhere
                GROUP BY region
                ORDER BY total_revenue DESC
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Recent activity
            $recentActivity = $conn->query("
                SELECT c.user_id, c.record_type, c.record_date, c.monthly_revenue,
                       c.data_source, c.country_code,
                       u.name, u.brand_name, u.category as user_category
                FROM $combined AS c
                JOIN users u ON c.user_id = u.id
                WHERE $cWhere
                ORDER BY c.updated_at DESC
                LIMIT 10
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Overall totals
            $totals = $conn->query("
                SELECT COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COALESCE(SUM(c.customer_count), 0) as total_customers,
                       COALESCE(SUM(c.transaction_count), 0) as total_transactions,
                       COUNT(*) as total_records,
                       COALESCE(AVG(NULLIF(c.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(AVG(NULLIF(c.avg_unit_price, 0)), 0) as avg_unit_price,
                       COALESCE(AVG(NULLIF(c.satisfaction, 0)), 0) as avg_satisfaction
                FROM $combined AS c
                WHERE $cWhere
            ")->fetch(PDO::FETCH_ASSOC);

            // Country-level breakdown (for country filter stats)
            $countryBreakdown = $conn->query("
                SELECT c.country_code,
                       COUNT(*) as record_count,
                       COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COUNT(DISTINCT c.user_id) as user_count
                FROM $combined AS c
                GROUP BY c.country_code
                ORDER BY total_revenue DESC
            ")->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "data" => [
                    "sellerCount" => intval($sellerCount),
                    "totals" => $totals,
                    "typeSummary" => $typeSummary,
                    "topSellers" => $topSellers,
                    "monthlyTrend" => array_reverse($monthlyTrend),
                    "categoryDist" => $categoryDist,
                    "regionDist" => $regionDist,
                    "recentActivity" => $recentActivity,
                    "availableCountries" => $availableCountries,
                    "countryBreakdown" => $countryBreakdown,
                ]
            ]);
            break;

        // ── SELLER DETAIL: Individual seller's stats ──
        case 'seller_detail':
            $sellerId = intval($_GET['seller_id'] ?? 0);
            if ($sellerId <= 0) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 셀러 ID입니다."]);
                exit;
            }

            // Seller/Vendor info
            $sellerInfo = $conn->prepare("SELECT id, name, brand_name, email, category, phone, role FROM users WHERE id = ?");
            $sellerInfo->execute([$sellerId]);
            $seller = $sellerInfo->fetch(PDO::FETCH_ASSOC);
            if (!$seller) {
                echo json_encode(["success" => false, "message" => "사용자를 찾을 수 없습니다."]);
                exit;
            }

            // All combined stats for this user
            $stats = $conn->query("
                SELECT c.* FROM $combined AS c WHERE c.user_id = $sellerId
                " . ($cWhere !== '1=1' ? "AND $cWhere" : "") . "
                ORDER BY c.record_date DESC
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Per-type summary
            $summaryRows = $conn->query("
                SELECT c.record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(c.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(c.customer_count), 0) as total_customers,
                       COALESCE(SUM(c.transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(c.avg_unit_price, 0)), 0) as avg_unit_price
                FROM $combined AS c
                WHERE c.user_id = $sellerId
                " . ($cWhere !== '1=1' ? "AND $cWhere" : "") . "
                GROUP BY c.record_type
            ")->fetchAll(PDO::FETCH_ASSOC);

            $summary = [];
            foreach ($summaryRows as $sr) {
                $summary[$sr['record_type']] = $sr;
            }

            echo json_encode([
                "success" => true,
                "seller" => $seller,
                "stats" => $stats,
                "summary" => $summary,
            ]);
            break;

        // ── SELLERS LIST: All sellers with stats summary ──
        case 'sellers_list':
            $sellers = $conn->query("
                SELECT c.user_id,
                       u.name, u.brand_name, u.category, u.email,
                       COUNT(*) as record_count,
                       COALESCE(SUM(c.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(c.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(c.customer_count), 0) as total_customers,
                       COALESCE(SUM(c.transaction_count), 0) as total_transactions,
                       MAX(c.record_date) as latest_record,
                       MAX(c.updated_at) as last_updated
                FROM $combined AS c
                JOIN users u ON c.user_id = u.id
                WHERE $cWhere
                GROUP BY c.user_id
                ORDER BY total_revenue DESC
            ")->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "sellers" => $sellers]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => '서버 오류가 발생했습니다.']);
}
?>