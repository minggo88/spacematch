<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

// Require login + seller role
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? $_SESSION['role'] ?? '';

if ($role !== 'seller') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "셀러만 이용 가능합니다."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? 'list';

// ── Auto-migration: ensure seller_stats table has all required columns ──
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS seller_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        country_code VARCHAR(2) NOT NULL DEFAULT 'KR',
        record_type VARCHAR(10) NOT NULL DEFAULT 'monthly',
        record_date VARCHAR(10) NOT NULL,
        monthly_revenue BIGINT DEFAULT 0,
        customer_count BIGINT DEFAULT 0,
        transaction_count BIGINT DEFAULT 0,
        avg_unit_price BIGINT DEFAULT 0,
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
        INDEX idx_type_date (record_type, record_date),
        INDEX idx_country (user_id, country_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add missing columns for existing tables
    $colsToAdd = [
        'country_code' => "VARCHAR(2) NOT NULL DEFAULT 'KR' AFTER user_id",
        'venue_type' => "VARCHAR(50) DEFAULT NULL AFTER best_selling_item",
        'region' => "VARCHAR(100) DEFAULT NULL AFTER venue_type",
        'region_detail' => "VARCHAR(500) DEFAULT NULL AFTER region",
        'satisfaction' => "TINYINT DEFAULT NULL AFTER region_detail",
        'memo' => "TEXT DEFAULT NULL AFTER satisfaction",
        'currency' => "VARCHAR(3) DEFAULT 'KRW' AFTER memo",
        'exchange_rate' => "DECIMAL(12,4) DEFAULT NULL AFTER currency",
        'source' => "VARCHAR(50) DEFAULT 'manual' AFTER exchange_rate",
        'import_batch_id' => "VARCHAR(36) DEFAULT NULL AFTER source",
        'sales_channel' => "VARCHAR(100) DEFAULT NULL AFTER import_batch_id",
        'product_name' => "VARCHAR(200) DEFAULT NULL AFTER sales_channel",
        'quantity_sold' => "INT DEFAULT 0 AFTER product_name",
        'cost_price' => "INT DEFAULT 0 AFTER quantity_sold",
        'profit_margin' => "DECIMAL(5,2) DEFAULT NULL AFTER cost_price",
        'discount_amount' => "BIGINT DEFAULT 0 AFTER profit_margin",
        'tax_amount' => "BIGINT DEFAULT 0 AFTER discount_amount",
        'shipping_cost' => "BIGINT DEFAULT 0 AFTER tax_amount",
        'refund_amount' => "BIGINT DEFAULT 0 AFTER shipping_cost",
        'commission_fee' => "BIGINT DEFAULT 0 AFTER refund_amount",
        'net_revenue' => "BIGINT DEFAULT 0 AFTER commission_fee",
        'payment_method' => "VARCHAR(100) DEFAULT NULL AFTER net_revenue",
        'order_number' => "VARCHAR(200) DEFAULT NULL AFTER payment_method",
        'sku' => "VARCHAR(200) DEFAULT NULL AFTER order_number",
        'brand' => "VARCHAR(200) DEFAULT NULL AFTER sku",
        'option_info' => "VARCHAR(500) DEFAULT NULL AFTER brand",
        'return_qty' => "INT DEFAULT 0 AFTER option_info",
        'profit_amount' => "BIGINT DEFAULT 0 AFTER return_qty",
        'points_used' => "BIGINT DEFAULT 0 AFTER profit_amount",
        'payment_status' => "VARCHAR(50) DEFAULT NULL AFTER points_used",
        'customer_name' => "VARCHAR(200) DEFAULT NULL AFTER payment_status",
        'staff_name' => "VARCHAR(200) DEFAULT NULL AFTER customer_name",
        'store_name' => "VARCHAR(200) DEFAULT NULL AFTER staff_name",
        'platform' => "VARCHAR(100) DEFAULT NULL AFTER store_name",
        'supplier' => "VARCHAR(200) DEFAULT NULL AFTER platform",
    ];
    foreach ($colsToAdd as $col => $def) {
        try {
            $conn->query("SELECT `$col` FROM seller_stats LIMIT 1");
        } catch (PDOException $ex) {
            $conn->exec("ALTER TABLE seller_stats ADD COLUMN `$col` $def");
        }
    }

    // Auto-migrate INT columns to BIGINT to prevent overflow
    $intToBigint = ['monthly_revenue', 'customer_count', 'transaction_count', 'avg_unit_price'];
    foreach ($intToBigint as $col) {
        try {
            $colInfo = $conn->query("SHOW COLUMNS FROM seller_stats WHERE Field = '$col'")->fetch(PDO::FETCH_ASSOC);
            if ($colInfo && stripos($colInfo['Type'], 'bigint') === false) {
                $conn->exec("ALTER TABLE seller_stats MODIFY COLUMN `$col` BIGINT DEFAULT 0");
            }
        } catch (PDOException $ex) { /* ignore */
        }
    }

    // Migrate UNIQUE KEY: remove if exists (allow product-level data)
    try {
        $keys = $conn->query("SHOW INDEX FROM seller_stats WHERE Key_name = 'uq_user_country_type_date'")->fetchAll();
        if (count($keys) > 0) {
            $conn->exec("ALTER TABLE seller_stats DROP INDEX uq_user_country_type_date");
        }
    } catch (PDOException $ex) { /* ignore */
    }
    try {
        $keys = $conn->query("SHOW INDEX FROM seller_stats WHERE Key_name = 'uq_user_type_date'")->fetchAll();
        if (count($keys) > 0) {
            $conn->exec("ALTER TABLE seller_stats DROP INDEX uq_user_type_date");
        }
    } catch (PDOException $ex) { /* ignore */
    }
} catch (PDOException $e) {
    // Table/columns already exist — ignore
}

try {
    switch ($action) {
        // ── LIST: 본인 데이터만 조회 ──
        case 'list':
            $type = $_GET['record_type'] ?? '';
            $countryCode = trim($_GET['country_code'] ?? 'ALL');

            // Build WHERE conditions
            $where = "user_id = ?";
            $params = [$userId];

            if ($type && in_array($type, ['daily', 'monthly', 'annual'])) {
                $where .= " AND record_type = ?";
                $params[] = $type;
            }
            if ($countryCode !== 'ALL' && $countryCode !== '') {
                $where .= " AND country_code = ?";
                $params[] = $countryCode;
            }

            $stmt = $conn->prepare("SELECT * FROM seller_stats WHERE $where ORDER BY record_date DESC");
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Summary per record_type (filtered by country)
            $summaryWhere = "user_id = ?";
            $summaryParams = [$userId];
            if ($countryCode !== 'ALL' && $countryCode !== '') {
                $summaryWhere .= " AND country_code = ?";
                $summaryParams[] = $countryCode;
            }
            $summaryStmt = $conn->prepare("
                SELECT record_type,
                       COUNT(*) as count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue,
                       COALESCE(AVG(NULLIF(monthly_revenue, 0)), 0) as avg_revenue,
                       COALESCE(SUM(customer_count), 0) as total_customers,
                       COALESCE(SUM(transaction_count), 0) as total_transactions,
                       COALESCE(AVG(NULLIF(avg_unit_price, 0)), 0) as avg_unit_price
                FROM seller_stats WHERE $summaryWhere GROUP BY record_type
            ");
            $summaryStmt->execute($summaryParams);
            $summaryRows = $summaryStmt->fetchAll(PDO::FETCH_ASSOC);
            $summary = [];
            foreach ($summaryRows as $sr) {
                $summary[$sr['record_type']] = $sr;
            }

            // Available countries for this user
            $countriesStmt = $conn->prepare("
                SELECT COALESCE(country_code, 'KR') as country_code,
                       COUNT(*) as record_count,
                       COALESCE(SUM(monthly_revenue), 0) as total_revenue
                FROM seller_stats WHERE user_id = ?
                GROUP BY country_code ORDER BY total_revenue DESC
            ");
            $countriesStmt->execute([$userId]);
            $countryBreakdown = $countriesStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "stats" => $rows,
                "summary" => $summary,
                "countryBreakdown" => $countryBreakdown,
            ]);
            break;

        // ── SAVE: UPSERT (기간 기준 생성/수정) ──
        case 'save':
            $recordType = $input['record_type'] ?? 'monthly';
            $recordDate = trim($input['record_date'] ?? '');

            // Validate record_type
            if (!in_array($recordType, ['daily', 'monthly', 'annual'])) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 기록 유형입니다."]);
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
                echo json_encode(["success" => false, "message" => "올바른 날짜 형식이 아닙니다."]);
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
            $countryCode = trim($input['country_code'] ?? 'KR');
            // Phase 1: new fields
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

            // Check if record exists (by id if editing, otherwise by composite key including country_code)
            $existingId = intval($input['id'] ?? 0);
            if ($existingId > 0) {
                $check = $conn->prepare("SELECT id FROM seller_stats WHERE id = ? AND user_id = ?");
                $check->execute([$existingId, $userId]);
            } else {
                $check = $conn->prepare("SELECT id FROM seller_stats WHERE user_id = ? AND country_code = ? AND record_type = ? AND record_date = ?");
                $check->execute([$userId, $countryCode, $recordType, $recordDate]);
            }
            $existing = $check->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $stmt = $conn->prepare("UPDATE seller_stats SET 
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
                echo json_encode(["success" => true, "message" => "데이터가 수정되었습니다.", "id" => $existing['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO seller_stats 
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
                echo json_encode(["success" => true, "message" => "데이터가 저장되었습니다.", "id" => $conn->lastInsertId()]);
            }
            break;

        // ── DELETE ──
        case 'delete':
            $id = intval($input['id'] ?? 0);
            if ($id <= 0) {
                echo json_encode(["success" => false, "message" => "유효하지 않은 ID입니다."]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM seller_stats WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $userId]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "데이터가 삭제되었습니다."]);
            } else {
                echo json_encode(["success" => false, "message" => "삭제할 데이터를 찾을 수 없습니다."]);
            }
            break;


        // ── IMPORT-related actions: delegate to seller_stats_import.php if it exists ──
        case 'import':
        case 'templates':
        case 'auto_map':
        case 'history':
        case 'undo_batch':
            $importFile = __DIR__ . '/seller_stats_import_logic.php';
            if (file_exists($importFile)) {
                include $importFile;
            } else {
                // ── Inline minimal import logic (fallback) ──
                if ($action === 'templates') {
                    echo json_encode(["success" => true, "templates" => [], "currencies" => ['KRW','USD','EUR','JPY','CNY','GBP','THB','VND','CAD','AUD']]);
                } elseif ($action === 'history') {
                    $stmt = $conn->prepare("
                        SELECT import_batch_id, source, sales_channel, currency,
                               COUNT(*) as record_count,
                               SUM(monthly_revenue) as total_revenue,
                               MIN(record_date) as date_from,
                               MAX(record_date) as date_to,
                               MIN(created_at) as imported_at
                        FROM seller_stats 
                        WHERE user_id = ? AND import_batch_id IS NOT NULL 
                        GROUP BY import_batch_id, source, sales_channel, currency
                        ORDER BY MIN(created_at) DESC
                        LIMIT 20
                    ");
                    $stmt->execute([$userId]);
                    echo json_encode(["success" => true, "batches" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
                } elseif ($action === 'undo_batch') {
                    $batchId = trim($input['batch_id'] ?? '');
                    if (empty($batchId)) {
                        echo json_encode(["success" => false, "message" => "Batch ID required."]);
                    } else {
                        $stmt = $conn->prepare("DELETE FROM seller_stats WHERE user_id = ? AND import_batch_id = ?");
                        $stmt->execute([$userId, $batchId]);
                        echo json_encode(["success" => true, "deleted" => $stmt->rowCount()]);
                    }
                } elseif ($action === 'auto_map') {
                    echo json_encode(["success" => true, "mapping" => []]);
                } elseif ($action === 'import') {
                    // ── Inline import logic ──
                    $rows = $input['rows'] ?? [];
                    $currency = trim($input['currency'] ?? 'KRW');
                    $recordType = trim($input['record_type'] ?? 'daily');
                    $salesChannel = trim($input['sales_channel'] ?? '');
                    $countryCode = 'KR';

                    if (empty($rows)) {
                        echo json_encode(["success" => false, "message" => "No data."]);
                        break;
                    }
                    if (!in_array($recordType, ['daily','monthly','annual'])) $recordType = 'daily';

                    $batchId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff),
                        mt_rand(0,0x0fff)|0x4000,mt_rand(0,0x3fff)|0x8000,
                        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff));

                    $stmt = $conn->prepare("INSERT INTO seller_stats 
                        (user_id, country_code, record_type, record_date, monthly_revenue, customer_count, transaction_count,
                         avg_unit_price, best_selling_item, product_name, quantity_sold, cost_price, profit_margin,
                         discount_amount, tax_amount, shipping_cost, refund_amount, commission_fee, net_revenue,
                         payment_method, order_number, sku, brand, option_info, return_qty, profit_amount,
                         points_used, payment_status, customer_name, staff_name, store_name, platform, supplier,
                         currency, source, import_batch_id, sales_channel, region, venue_type, satisfaction, memo)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                    $inserted = 0; $skipped = 0; $errors = [];
                    foreach ($rows as $i => $row) {
                        $date = trim($row['record_date'] ?? '');
                        if (empty($date)) { $skipped++; continue; }
                        // Basic date normalization
                        $date = str_replace(['/', '.'], '-', $date);
                        if (preg_match('/^(\d{4}[-]\d{1,2}[-]\d{1,2})/', $date, $m)) $date = $m[1];
                        elseif (is_numeric($date) && intval($date) > 30000 && intval($date) < 60000) {
                            $date = date('Y-m-d', ($date - 25569) * 86400);
                        }
                        // Validate date
                        if ($recordType === 'daily' && !preg_match('/^\d{4}-\d{1,2}-\d{1,2}$/', $date)) { $skipped++; continue; }

                        $revenue = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['monthly_revenue'] ?? 0)));
                        $customers = intval($row['customer_count'] ?? 0);
                        $transactions = intval($row['transaction_count'] ?? 0);
                        $quantitySold = intval($row['quantity_sold'] ?? 0);
                        $costPrice = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['cost_price'] ?? 0)));
                        $unitPrice = intval($row['avg_unit_price'] ?? 0);
                        if ($unitPrice <= 0 && $transactions > 0 && $revenue > 0) $unitPrice = round($revenue / $transactions);
                        if ($transactions === 0 && $quantitySold > 0) { $transactions = $quantitySold; if ($unitPrice <= 0 && $revenue > 0) $unitPrice = round($revenue / $quantitySold); }
                        $profitMargin = ($revenue > 0 && $costPrice > 0) ? round((($revenue - $costPrice) / $revenue) * 100, 2) : null;
                        $discountAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['discount_amount'] ?? 0)));
                        $taxAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['tax_amount'] ?? 0)));
                        $shippingCost = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['shipping_cost'] ?? 0)));
                        $refundAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['refund_amount'] ?? 0)));
                        $commissionFee = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['commission_fee'] ?? 0)));
                        $netRevenue = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['net_revenue'] ?? 0)));
                        if ($netRevenue === 0 && $revenue > 0) $netRevenue = $revenue - $discountAmount - $taxAmount - $commissionFee - $refundAmount;
                        $profitAmount = intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['profit_amount'] ?? 0)));
                        if ($profitAmount === 0 && $revenue > 0 && $costPrice > 0) $profitAmount = $revenue - $costPrice;

                        try {
                            $stmt->execute([
                                $userId, $countryCode, $recordType, $date,
                                $revenue, $customers, $transactions, $unitPrice,
                                trim($row['best_selling_item'] ?? ''), trim($row['product_name'] ?? ''),
                                $quantitySold, $costPrice, $profitMargin,
                                $discountAmount, $taxAmount, $shippingCost, $refundAmount,
                                $commissionFee, $netRevenue,
                                trim($row['payment_method'] ?? ''), trim($row['order_number'] ?? ''),
                                trim($row['sku'] ?? ''), trim($row['brand'] ?? ''), trim($row['option_info'] ?? ''),
                                intval($row['return_qty'] ?? 0), $profitAmount,
                                intval(preg_replace('/[^\d.\-]/', '', str_replace(',', '', $row['points_used'] ?? 0))),
                                trim($row['payment_status'] ?? ''), trim($row['customer_name'] ?? ''),
                                trim($row['staff_name'] ?? ''), trim($row['store_name'] ?? ''),
                                trim($row['platform'] ?? ''), trim($row['supplier'] ?? ''),
                                $currency, 'excel', $batchId,
                                $salesChannel ?: trim($row['platform'] ?? ''),
                                trim($row['region'] ?? ''), trim($row['venue_type'] ?? ''),
                                (intval($row['satisfaction'] ?? 0) >= 0 && intval($row['satisfaction'] ?? 0) <= 5) ? intval($row['satisfaction'] ?? 0) ?: null : null,
                                trim($row['memo'] ?? '')
                            ]);
                            $inserted++;
                        } catch (PDOException $e) {
                            $skipped++;
                            $errors[] = ['row' => $i + 1, 'error' => $e->getMessage()];
                        }
                    }
                    echo json_encode([
                        "success" => true, "batch_id" => $batchId,
                        "inserted" => $inserted, "skipped" => $skipped,
                        "total" => count($rows), "errors" => array_slice($errors, 0, 10)
                    ]);
                }
            break;

        default:
            echo json_encode(["success" => false, "message" => "알 수 없는 액션입니다."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>