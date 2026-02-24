<?php
/**
 * Vendor Stats Management API
 * 
 * Provides revenue/sales data tracking for vendor users.
 * Nearly identical to seller_stats.php but with:
 *   - role check: 'host' instead of 'seller'
 *   - table: vendor_stats (with country_code column)
 *   - country_code filter support
 * 
 * Actions:
 *   - list   : Get vendor's own stats (filterable by record_type & country_code)
 *   - save   : Create/update a stats record
 *   - delete : Delete a stats record
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + vendor role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Login required."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if ($role !== 'host') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Vendor only."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? 'list';

// ── Auto-migration: ensure vendor_stats table exists with all columns ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS vendor_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        country_code VARCHAR(2) NOT NULL DEFAULT 'KR',
        record_type VARCHAR(10) NOT NULL DEFAULT 'monthly',
        record_date VARCHAR(10) NOT NULL,
        monthly_revenue INT DEFAULT 0,
        customer_count INT DEFAULT 0,
        transaction_count INT DEFAULT 0,
        avg_unit_price INT DEFAULT 0,
        best_selling_item VARCHAR(200) DEFAULT NULL,
        venue_type VARCHAR(50) DEFAULT NULL,
        region VARCHAR(100) DEFAULT NULL,
        region_detail VARCHAR(500) DEFAULT NULL,
        satisfaction TINYINT DEFAULT NULL,
        memo TEXT DEFAULT NULL,
        currency VARCHAR(3) DEFAULT 'KRW',
        exchange_rate DECIMAL(12,4) DEFAULT NULL,
        source VARCHAR(50) DEFAULT 'manual',
        import_batch_id VARCHAR(36) DEFAULT NULL,
        sales_channel VARCHAR(100) DEFAULT NULL,
        product_name VARCHAR(200) DEFAULT NULL,
        quantity_sold INT DEFAULT 0,
        cost_price INT DEFAULT 0,
        profit_margin DECIMAL(5,2) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_country (user_id, country_code),
        INDEX idx_type_date (record_type, record_date),
        UNIQUE KEY uq_user_country_type_date (user_id, country_code, record_type, record_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add country_code column if missing (for existing tables)
    try {
        $conn->query("SELECT `country_code` FROM vendor_stats LIMIT 1");
    } catch (PDOException $ex) {
        $conn->exec("ALTER TABLE vendor_stats ADD COLUMN `country_code` VARCHAR(2) NOT NULL DEFAULT 'KR' AFTER user_id");
        // Drop old unique key and add new one including country_code
        try {
            $conn->exec("ALTER TABLE vendor_stats DROP INDEX uq_user_type_date");
        } catch (PDOException $ignore) {
        }
        $conn->exec("ALTER TABLE vendor_stats ADD UNIQUE KEY uq_user_country_type_date (user_id, country_code, record_type, record_date)");
    }
} catch (PDOException $e) {
    // Table/columns already exist — ignore
}

try {
    switch ($action) {
        // ── LIST: Own data only, with optional country_code filter ──
        case 'list':
            $type = $_GET['record_type'] ?? '';
            $country = strtoupper(trim($_GET['country_code'] ?? $input['country_code'] ?? ''));

            $where = "WHERE user_id = ?";
            $params = [$userId];

            if ($country) {
                $where .= " AND country_code = ?";
                $params[] = $country;
            }
            if ($type && in_array($type, ['daily', 'monthly', 'annual'])) {
                $where .= " AND record_type = ?";
                $params[] = $type;
            }

            $stmt = $conn->prepare("SELECT * FROM vendor_stats $where ORDER BY record_date DESC");
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Summary per record_type (filtered by country if specified)
            $summaryWhere = "WHERE user_id = ?";
            $summaryParams = [$userId];
            if ($country) {
                $summaryWhere .= " AND country_code = ?";
                $summaryParams[] = $country;
            }

            $summaryStmt = $conn->prepare("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price
                FROM vendor_stats $summaryWhere GROUP BY record_type
            ");
            $summaryStmt->execute($summaryParams);
            $summaryRows = $summaryStmt->fetchAll(PDO::FETCH_ASSOC);
            $summary = [];
            foreach ($summaryRows as $sr) {
                $summary[$sr['record_type']] = $sr;
            }

            // Also return available countries for this vendor
            $countryStmt = $conn->prepare("SELECT DISTINCT country_code FROM vendor_stats WHERE user_id = ? ORDER BY country_code");
            $countryStmt->execute([$userId]);
            $countries = $countryStmt->fetchAll(PDO::FETCH_COLUMN);

            echo json_encode(["success" => true, "stats" => $rows, "summary" => $summary, "countries" => $countries]);
            break;

        // ── SAVE: UPSERT (create/update by composite key) ──
        case 'save':
            $recordType = $input['record_type'] ?? 'monthly';
            $recordDate = trim($input['record_date'] ?? '');
            $countryCode = strtoupper(trim($input['country_code'] ?? 'KR'));

            // Validate country_code
            $validCountries = ['KR', 'US', 'GB', 'CA', 'JP', 'VN', 'TH', 'KH', 'RU', 'UA', 'DE', 'SG'];
            if (!in_array($countryCode, $validCountries)) {
                echo json_encode(["success" => false, "message" => "Invalid country code."]);
                exit;
            }

            // Validate record_type
            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                echo json_encode(["success" => false, "message" => "Invalid record type."]);
                exit;
            }

            // Validate record_date format
            $valid = false;
            if ($recordType === 'daily' && preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $recordDate))
                $valid = true;
            if ($recordType === 'monthly' && preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $recordDate))
                $valid = true;
            if ($recordType === 'annual' && preg_match('/^\d{4}$/', $recordDate))
                $valid = true;

            if (!$valid) {
                echo json_encode(["success" => false, "message" => "Invalid date format."]);
                exit;
            }

            $revenue = intval($input['monthly_revenue'] ?? 0);
            $customers = intval($input['customer_count'] ?? 0);
            $transactions = intval($input['transaction_count'] ?? 0);
            $unitPrice = intval($input['avg_unit_price'] ?? 0);
            $bestItem = trim($input['best_selling_item'] ?? '');
            $venueType = trim($input['venue_type'] ?? '');
            $region = trim($input['region'] ?? '');
            $regionDetail = trim($input['region_detail'] ?? '');
            $satisfaction = intval($input['satisfaction'] ?? 0);
            $memo = trim($input['memo'] ?? '');
            $currency = trim($input['currency'] ?? 'KRW');
            $source = trim($input['source'] ?? 'manual');
            $salesChannel = trim($input['sales_channel'] ?? '');
            $productName = trim($input['product_name'] ?? '');
            $quantitySold = intval($input['quantity_sold'] ?? 0);
            $costPrice = intval($input['cost_price'] ?? 0);
            $profitMargin = isset($input['profit_margin']) ? floatval($input['profit_margin']) : null;

            if ($satisfaction < 0 || $satisfaction > 5)
                $satisfaction = 0;

            // Auto-calculate profit margin if not provided
            if ($profitMargin === null && $revenue > 0 && $costPrice > 0) {
                $profitMargin = round((($revenue - $costPrice) / $revenue) * 100, 2);
            }

            // Check if record exists
            $existingId = intval($input['id'] ?? 0);
            if ($existingId > 0) {
                $check = $conn->prepare("SELECT id FROM vendor_stats WHERE id = ? AND user_id = ?");
                $check->execute([$existingId, $userId]);
            } else {
                $check = $conn->prepare("SELECT id FROM vendor_stats WHERE user_id = ? AND country_code = ? AND record_type = ? AND record_date = ?");
                $check->execute([$userId, $countryCode, $recordType, $recordDate]);
            }
            $existing = $check->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $stmt = $conn->prepare("UPDATE vendor_stats SET 
                    country_code = ?, monthly_revenue = ?, customer_count = ?, transaction_count = ?,
                    avg_unit_price = ?, best_selling_item = ?, venue_type = ?,
                    region = ?, region_detail = ?, satisfaction = ?, memo = ?,
                    currency = ?, source = ?, sales_channel = ?,
                    product_name = ?, quantity_sold = ?, cost_price = ?, profit_margin = ?
                    WHERE id = ? AND user_id = ?");
                $stmt->execute([
                    $countryCode,
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $regionDetail,
                    $satisfaction ?: null,
                    $memo,
                    $currency,
                    $source,
                    $salesChannel,
                    $productName,
                    $quantitySold,
                    $costPrice,
                    $profitMargin,
                    $existing['id'],
                    $userId
                ]);
                echo json_encode(["success" => true, "message" => "Record updated.", "id" => $existing['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO vendor_stats 
                    (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                     avg_unit_price, best_selling_item, venue_type, region, region_detail, satisfaction, memo,
                     currency, source, sales_channel, product_name, quantity_sold, cost_price, profit_margin)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $userId,
                    $countryCode,
                    $recordType,
                    $recordDate,
                    $revenue,
                    $customers,
                    $transactions,
                    $unitPrice,
                    $bestItem,
                    $venueType,
                    $region,
                    $regionDetail,
                    $satisfaction ?: null,
                    $memo,
                    $currency,
                    $source,
                    $salesChannel,
                    $productName,
                    $quantitySold,
                    $costPrice,
                    $profitMargin
                ]);
                echo json_encode(["success" => true, "message" => "Record saved.", "id" => $conn->lastInsertId()]);
            }
            break;

        // ── DELETE ──
        case 'delete':
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(["success" => false, "message" => "Invalid ID."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM vendor_stats WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "Record deleted."]);
            } else {
                echo json_encode(["success" => false, "message" => "Record not found."]);
            }
            break;

        default:
            echo json_encode(["success" => false, "message" => "Unknown action: $action"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>