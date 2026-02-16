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

// ── Auto-create seller_stats table if missing ──
try {
    $conn->query("SELECT 1 FROM seller_stats LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        record_type VARCHAR(20) DEFAULT 'monthly',
        record_date VARCHAR(20) DEFAULT '',
        monthly_revenue DECIMAL(15,2) DEFAULT 0,
        customer_count INT DEFAULT 0,
        transaction_count INT DEFAULT 0,
        avg_unit_price DECIMAL(15,2) DEFAULT 0,
        best_selling_item VARCHAR(255) DEFAULT '',
        region VARCHAR(100) DEFAULT '',
        satisfaction DECIMAL(3,1) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_record_type (record_type),
        INDEX idx_record_date (record_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}

try {
    switch ($action) {

        // ── OVERVIEW: Dashboard summary across all sellers ──
        case 'overview':
            // Total sellers with stats
            $sellerCount = $conn->query("SELECT COUNT(DISTINCT user_id) FROM seller_stats")->fetchColumn();

            // Per record_type summary
            $typeSummary = $conn->query("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price,
                       MAX(updated_at) as last_updated
                FROM seller_stats GROUP BY record_type
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Top sellers by total revenue (all time)
            $topSellers = $conn->query("
                SELECT s.user_id,
                       u.name, u.brand_name, u.category, u.email,
                       COUNT(*) as record_count,
                       COALESCE(SUM(s.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(s.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(s.customer_count), 0) as total_customers,
                       COALESCE(SUM(s.transaction_count), 0) as total_transactions,
                       MAX(s.record_date) as latest_record,
                       MAX(s.updated_at) as last_updated
                FROM seller_stats s
                JOIN users u ON s.user_id = u.id
                GROUP BY s.user_id
                ORDER BY total_revenue DESC
                LIMIT 20
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Monthly trend (all sellers combined, last 12 months)
            $monthlyTrend = $conn->query("
                SELECT CASE 
                    WHEN record_type = 'daily' THEN LEFT(record_date, 7)
                    WHEN record_type = 'monthly' THEN record_date
                    WHEN record_type = 'annual' THEN record_date
                    ELSE record_date
                END as period,
                SUM(monthly_revenue) as total_revenue,
                COUNT(DISTINCT user_id) as seller_count,
                AVG(NULLIF(monthly_revenue, 0)) as avg_revenue
                FROM seller_stats
                WHERE record_type = 'monthly'
                GROUP BY period
                ORDER BY period DESC
                LIMIT 12
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Category distribution
            $categoryDist = $conn->query("
                SELECT COALESCE(s.best_selling_item, '미지정') as category,
                       COUNT(*) as count,
                       SUM(s.monthly_revenue) as total_revenue,
                       COUNT(DISTINCT s.user_id) as seller_count
                FROM seller_stats s
                WHERE s.best_selling_item IS NOT NULL AND s.best_selling_item != ''
                GROUP BY category
                ORDER BY total_revenue DESC
                LIMIT 15
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Region distribution
            $regionDist = $conn->query("
                SELECT COALESCE(region, '미지정') as region,
                       COUNT(*) as count,
                       SUM(monthly_revenue) as total_revenue,
                       COUNT(DISTINCT user_id) as seller_count
                FROM seller_stats
                WHERE region IS NOT NULL AND region != ''
                GROUP BY region
                ORDER BY total_revenue DESC
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Recent activity
            $recentActivity = $conn->query("
                SELECT s.*, u.name, u.brand_name, u.category as user_category
                FROM seller_stats s
                JOIN users u ON s.user_id = u.id
                ORDER BY s.updated_at DESC
                LIMIT 10
            ")->fetchAll(PDO::FETCH_ASSOC);

            // Overall totals
            $totals = $conn->query("
                SELECT COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COUNT(*) as total_records,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price,
                       COALESCE(AVG(NULLIF(satisfaction, 0)), 0) as avg_satisfaction
                FROM seller_stats
            ")->fetch(PDO::FETCH_ASSOC);

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

            // Seller info
            $sellerInfo = $conn->prepare("SELECT id, name, brand_name, email, category, phone FROM users WHERE id = ? AND role = 'seller'");
            $sellerInfo->execute([$sellerId]);
            $seller = $sellerInfo->fetch(PDO::FETCH_ASSOC);
            if (!$seller) {
                echo json_encode(["success" => false, "message" => "셀러를 찾을 수 없습니다."]);
                exit;
            }

            // All stats for this seller
            $statsStmt = $conn->prepare("SELECT * FROM seller_stats WHERE user_id = ? ORDER BY record_date DESC");
            $statsStmt->execute([$sellerId]);
            $stats = $statsStmt->fetchAll(PDO::FETCH_ASSOC);

            // Per-type summary
            $summaryStmt = $conn->prepare("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price
                FROM seller_stats WHERE user_id = ? GROUP BY record_type
            ");
            $summaryStmt->execute([$sellerId]);
            $summary = [];
            foreach ($summaryStmt->fetchAll(PDO::FETCH_ASSOC) as $sr) {
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
                SELECT s.user_id,
                       u.name, u.brand_name, u.category, u.email,
                       COUNT(*) as record_count,
                       COALESCE(SUM(s.monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(s.monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(s.customer_count), 0) as total_customers,
                       COALESCE(SUM(s.transaction_count), 0) as total_transactions,
                       MAX(s.record_date) as latest_record,
                       MAX(s.updated_at) as last_updated
                FROM seller_stats s
                JOIN users u ON s.user_id = u.id
                GROUP BY s.user_id
                ORDER BY total_revenue DESC
            ")->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "sellers" => $sellers]);
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>