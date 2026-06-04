<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../db_connect.php';
session_start();

// SUPERADMIN ONLY
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'superadmin') {
    http_response_code(403);
    echo json_encode(["error" => "접근 권한이 없습니다. 슈퍼관리자만 접근 가능합니다."]);
    exit;
}

$action = $_GET['action'] ?? '';

// DB selection (for future dev/prod separation)
$dbParam = $_GET['db'] ?? 'production';
$dbMap = [
    'development' => ['host' => 'localhost', 'name' => 'spacematch', 'user' => 'spacematch', 'pass' => 'qortpdnd91!@'],
    'production' => ['host' => 'localhost', 'name' => 'spacematch', 'user' => 'spacematch', 'pass' => 'qortpdnd91!@']
];
$dbConfig = $dbMap[$dbParam] ?? $dbMap['production'];

try {
    $dbConn = new PDO(
        "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset=utf8mb4",
        $dbConfig['user'],
        $dbConfig['pass']
    );
    $dbConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(["error" => '서버 오류가 발생했습니다.']);
    exit;
}

// ─── Helper: rich table overview ────────────────────────
function getTableOverview($dbConn, $dbName)
{
    $tables = [];

    // Batch: get all metadata from information_schema
    $metaStmt = $dbConn->prepare("
        SELECT TABLE_NAME, ENGINE, TABLE_COLLATION, AUTO_INCREMENT,
               TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH,
               ROUND((DATA_LENGTH + INDEX_LENGTH)/1024, 2) AS size_kb,
               ROUND(DATA_LENGTH/1024, 2) AS data_kb,
               ROUND(INDEX_LENGTH/1024, 2) AS index_kb,
               CREATE_TIME, UPDATE_TIME
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    ");
    $metaStmt->execute([$dbName]);
    $metaRows = $metaStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($metaRows as $meta) {
        $tableName = $meta['TABLE_NAME'];

        // Accurate row count
        $countStmt = $dbConn->query("SELECT COUNT(*) as cnt FROM `{$tableName}`");
        $rowCount = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Column info (with full details)
        $colStmt = $dbConn->query("SHOW FULL COLUMNS FROM `{$tableName}`");
        $columns = $colStmt->fetchAll(PDO::FETCH_ASSOC);

        // Indexes
        $idxStmt = $dbConn->query("SHOW INDEX FROM `{$tableName}`");
        $indexes = $idxStmt->fetchAll(PDO::FETCH_ASSOC);

        // Group indexes by Key_name
        $indexGroups = [];
        foreach ($indexes as $idx) {
            $keyName = $idx['Key_name'];
            if (!isset($indexGroups[$keyName])) {
                $indexGroups[$keyName] = [
                    'name' => $keyName,
                    'unique' => !$idx['Non_unique'],
                    'type' => $idx['Index_type'] ?? 'BTREE',
                    'columns' => []
                ];
            }
            $indexGroups[$keyName]['columns'][] = $idx['Column_name'];
        }

        // Foreign keys
        $fkStmt = $dbConn->prepare("
            SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME, CONSTRAINT_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        $fkStmt->execute([$dbName, $tableName]);
        $foreignKeys = $fkStmt->fetchAll(PDO::FETCH_ASSOC);

        // Classify columns
        $pkCols = [];
        $nullableCols = 0;
        $indexedCols = 0;
        foreach ($columns as $col) {
            if ($col['Key'] === 'PRI')
                $pkCols[] = $col['Field'];
            if ($col['Null'] === 'YES')
                $nullableCols++;
            if (!empty($col['Key']))
                $indexedCols++;
        }

        $tables[] = [
            'name' => $tableName,
            'row_count' => $rowCount,
            'column_count' => count($columns),
            'columns' => $columns,
            'primary_keys' => $pkCols,
            'nullable_count' => $nullableCols,
            'indexed_count' => $indexedCols,
            'indexes' => array_values($indexGroups),
            'foreign_keys' => $foreignKeys,
            'engine' => $meta['ENGINE'],
            'collation' => $meta['TABLE_COLLATION'],
            'auto_increment' => $meta['AUTO_INCREMENT'] ? intval($meta['AUTO_INCREMENT']) : null,
            'size_kb' => floatval($meta['size_kb']),
            'data_kb' => floatval($meta['data_kb']),
            'index_kb' => floatval($meta['index_kb']),
            'created_at' => $meta['CREATE_TIME'],
            'updated_at' => $meta['UPDATE_TIME']
        ];
    }

    return $tables;
}

switch ($action) {
    // ─── Overview ────────────────────────────────────────
    case 'overview':
        $tables = getTableOverview($dbConn, $dbConfig['name']);
        $totalRows = array_sum(array_column($tables, 'row_count'));
        $totalSize = array_sum(array_column($tables, 'size_kb'));
        $totalDataSize = array_sum(array_column($tables, 'data_kb'));
        $totalIndexSize = array_sum(array_column($tables, 'index_kb'));
        $totalColumns = array_sum(array_column($tables, 'column_count'));

        // DB variables
        $verStmt = $dbConn->query("SELECT VERSION() as ver");
        $version = $verStmt->fetch(PDO::FETCH_ASSOC)['ver'];

        $charsetStmt = $dbConn->query("SELECT @@character_set_database as cs, @@collation_database as col");
        $charset = $charsetStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'database' => $dbConfig['name'],
            'env' => $dbParam,
            'version' => $version,
            'charset' => $charset['cs'],
            'collation' => $charset['col'],
            'table_count' => count($tables),
            'total_rows' => $totalRows,
            'total_columns' => $totalColumns,
            'total_size_kb' => $totalSize,
            'total_data_kb' => $totalDataSize,
            'total_index_kb' => $totalIndexSize,
            'tables' => $tables
        ]);
        break;

    // ─── Table Data (paginated) ──────────────────────────
    case 'table_data':
        $table = $_GET['table'] ?? '';
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = min(100, max(10, intval($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;
        $search = $_GET['search'] ?? '';
        $sortCol = $_GET['sort'] ?? '';
        $sortDir = strtoupper($_GET['dir'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';

        if (empty($table)) {
            echo json_encode(["error" => "테이블명이 필요합니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // Columns
        $colStmt = $dbConn->query("SHOW FULL COLUMNS FROM `{$table}`");
        $columns = $colStmt->fetchAll(PDO::FETCH_ASSOC);
        $primaryKey = null;
        foreach ($columns as $col) {
            if ($col['Key'] === 'PRI') {
                $primaryKey = $col['Field'];
                break;
            }
        }

        // Search
        $whereClause = '';
        $params = [];
        if (!empty($search)) {
            $searchConds = [];
            foreach ($columns as $col) {
                $searchConds[] = "`{$col['Field']}` LIKE ?";
                $params[] = "%{$search}%";
            }
            $whereClause = 'WHERE ' . implode(' OR ', $searchConds);
        }

        // Sort
        $orderClause = '';
        if (!empty($sortCol)) {
            // Validate column exists
            $colNames = array_column($columns, 'Field');
            if (in_array($sortCol, $colNames)) {
                $orderClause = "ORDER BY `{$sortCol}` {$sortDir}";
            }
        }

        // Count
        $countStmt = $dbConn->prepare("SELECT COUNT(*) as cnt FROM `{$table}` {$whereClause}");
        $countStmt->execute($params);
        $totalRows = intval($countStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

        // Data
        $dataStmt = $dbConn->prepare("SELECT * FROM `{$table}` {$whereClause} {$orderClause} LIMIT {$limit} OFFSET {$offset}");
        $dataStmt->execute($params);
        $rows = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

        // Column statistics for numeric/date cols (sample for small tables)
        $colStats = [];
        if ($totalRows > 0 && $totalRows <= 50000) {
            foreach ($columns as $col) {
                $type = strtolower($col['Type']);
                if (preg_match('/int|decimal|float|double|numeric/', $type)) {
                    try {
                        $statStmt = $dbConn->query("SELECT MIN(`{$col['Field']}`) as min_val, MAX(`{$col['Field']}`) as max_val, AVG(`{$col['Field']}`) as avg_val, COUNT(DISTINCT `{$col['Field']}`) as distinct_count FROM `{$table}`");
                        $colStats[$col['Field']] = $statStmt->fetch(PDO::FETCH_ASSOC);
                    } catch (PDOException $e) {
                    }
                } elseif (preg_match('/varchar|text|char|enum/', $type)) {
                    try {
                        $statStmt = $dbConn->query("SELECT COUNT(DISTINCT `{$col['Field']}`) as distinct_count, SUM(CASE WHEN `{$col['Field']}` IS NULL OR `{$col['Field']}` = '' THEN 1 ELSE 0 END) as empty_count FROM `{$table}`");
                        $colStats[$col['Field']] = $statStmt->fetch(PDO::FETCH_ASSOC);
                    } catch (PDOException $e) {
                    }
                }
            }
        }

        echo json_encode([
            'table' => $table,
            'columns' => $columns,
            'primary_key' => $primaryKey,
            'rows' => $rows,
            'total_rows' => $totalRows,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => max(1, ceil($totalRows / $limit)),
            'col_stats' => $colStats
        ]);
        break;

    // ─── Update Row ──────────────────────────────────────
    case 'update_row':
        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $primaryKey = $input['primary_key'] ?? '';
        $primaryValue = $input['primary_value'] ?? '';
        $field = $input['field'] ?? '';
        $value = $input['value'];

        if (empty($table) || empty($primaryKey) || empty($field)) {
            echo json_encode(["error" => "필수 파라미터가 누락되었습니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // Allow setting NULL
        if ($value === '__NULL__') {
            $stmt = $dbConn->prepare("UPDATE `{$table}` SET `{$field}` = NULL WHERE `{$primaryKey}` = ?");
            $result = $stmt->execute([$primaryValue]);
        } else {
            $stmt = $dbConn->prepare("UPDATE `{$table}` SET `{$field}` = ? WHERE `{$primaryKey}` = ?");
            $result = $stmt->execute([$value, $primaryValue]);
        }
        echo json_encode([
            "success" => $result,
            "message" => $result ? "수정 완료" : "수정 실패",
            "affected_rows" => $stmt->rowCount()
        ]);
        break;

    // ─── Delete Row → Move to Trash ─────────────────────
    case 'delete_row':
        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $primaryKey = $input['primary_key'] ?? '';
        $primaryValue = $input['primary_value'] ?? '';

        if (empty($table) || empty($primaryKey) || $primaryValue === '') {
            echo json_encode(["error" => "필수 파라미터가 누락되었습니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // Move to trash before deleting
        try {
            // Use main $conn for trash_bin (always in spacematch DB)
            $conn->exec("CREATE TABLE IF NOT EXISTS trash_bin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                table_name VARCHAR(100) NOT NULL,
                record_id VARCHAR(100) NOT NULL,
                item_label VARCHAR(255) DEFAULT '',
                record_data JSON NULL,
                deleted_by INT NULL,
                deleted_by_name VARCHAR(100) DEFAULT '',
                deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_table (table_name),
                INDEX idx_deleted_at (deleted_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

            $fetchStmt = $dbConn->prepare("SELECT * FROM `{$table}` WHERE `{$primaryKey}` = ? LIMIT 1");
            $fetchStmt->execute([$primaryValue]);
            $rowData = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            if ($rowData) {
                $label = $rowData['title'] ?? $rowData['name'] ?? $rowData['content'] ?? ($table . ' #' . $primaryValue);
                if (is_string($label) && mb_strlen($label) > 50)
                    $label = mb_substr($label, 0, 50);
                $trashStmt = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (?,?,?,?,?,?)");
                $trashStmt->execute([
                    $table,
                    $primaryValue,
                    $label,
                    json_encode($rowData, JSON_UNESCAPED_UNICODE),
                    $_SESSION['user_id'],
                    $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'SuperAdmin'
                ]);
            }
        } catch (PDOException $trashErr) {
            // Non-critical: proceed with delete even if trash fails
            error_log("Trash save failed: " . $trashErr->getMessage());
        }

        $stmt = $dbConn->prepare("DELETE FROM `{$table}` WHERE `{$primaryKey}` = ?");
        $result = $stmt->execute([$primaryValue]);
        echo json_encode([
            "success" => $result,
            "message" => $result ? "휴지통으로 이동되었습니다." : "삭제 실패",
            "affected_rows" => $stmt->rowCount()
        ]);
        break;

    // ─── Batch Delete Rows → Move to Trash ─────────────
    case 'batch_delete':
        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $primaryKey = $input['primary_key'] ?? '';
        $primaryValues = $input['primary_values'] ?? [];

        if (empty($table) || empty($primaryKey) || !is_array($primaryValues) || count($primaryValues) === 0) {
            echo json_encode(["error" => "필수 파라미터가 누락되었습니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        try {
            // Move all rows to trash before deleting
            try {
                $conn->exec("CREATE TABLE IF NOT EXISTS trash_bin (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    table_name VARCHAR(100) NOT NULL,
                    record_id VARCHAR(100) NOT NULL,
                    item_label VARCHAR(255) DEFAULT '',
                    record_data JSON NULL,
                    deleted_by INT NULL,
                    deleted_by_name VARCHAR(100) DEFAULT '',
                    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_table (table_name),
                    INDEX idx_deleted_at (deleted_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                $placeholdersSelect = implode(',', array_fill(0, count($primaryValues), '?'));
                $fetchAll = $dbConn->prepare("SELECT * FROM `{$table}` WHERE `{$primaryKey}` IN ({$placeholdersSelect})");
                $fetchAll->execute($primaryValues);
                $allRows = $fetchAll->fetchAll(PDO::FETCH_ASSOC);

                $trashStmt = $conn->prepare("INSERT INTO trash_bin (table_name, record_id, item_label, record_data, deleted_by, deleted_by_name) VALUES (?,?,?,?,?,?)");
                foreach ($allRows as $rowData) {
                    $pv = $rowData[$primaryKey] ?? '';
                    $label = $rowData['title'] ?? $rowData['name'] ?? $rowData['content'] ?? ($table . ' #' . $pv);
                    if (is_string($label) && mb_strlen($label) > 50)
                        $label = mb_substr($label, 0, 50);
                    $trashStmt->execute([
                        $table,
                        $pv,
                        $label,
                        json_encode($rowData, JSON_UNESCAPED_UNICODE),
                        $_SESSION['user_id'],
                        $_SESSION['user_name'] ?? $_SESSION['nickname'] ?? 'SuperAdmin'
                    ]);
                }
            } catch (PDOException $trashErr) {
                error_log("Batch trash save failed: " . $trashErr->getMessage());
            }

            $dbConn->beginTransaction();
            $placeholders = implode(',', array_fill(0, count($primaryValues), '?'));
            $stmt = $dbConn->prepare("DELETE FROM `{$table}` WHERE `{$primaryKey}` IN ({$placeholders})");
            $result = $stmt->execute($primaryValues);
            $affected = $stmt->rowCount();
            $dbConn->commit();
            echo json_encode([
                "success" => $result,
                "message" => $result ? "{$affected}개 항목이 휴지통으로 이동되었습니다." : "삭제 실패",
                "affected_rows" => $affected
            ]);
        } catch (PDOException $e) {
            if ($dbConn->inTransaction())
                $dbConn->rollBack();
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo json_encode(["error" => '서버 오류가 발생했습니다.']);
        }
        break;

    // ─── Table Structure ─────────────────────────────────
    case 'table_structure':
        $table = $_GET['table'] ?? '';
        if (empty($table)) {
            echo json_encode(["error" => "테이블명이 필요합니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // CREATE TABLE statement
        $createStmt = $dbConn->query("SHOW CREATE TABLE `{$table}`");
        $createRow = $createStmt->fetch(PDO::FETCH_ASSOC);
        $createSQL = $createRow['Create Table'] ?? '';

        // Full column details
        $colStmt = $dbConn->query("SHOW FULL COLUMNS FROM `{$table}`");
        $columns = $colStmt->fetchAll(PDO::FETCH_ASSOC);

        // Indexes
        $idxStmt = $dbConn->query("SHOW INDEX FROM `{$table}`");
        $indexes = $idxStmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'table' => $table,
            'create_sql' => $createSQL,
            'columns' => $columns,
            'indexes' => $indexes
        ]);
        break;

    // ─── Insert Row ──────────────────────────────────────
    case 'insert_row':
        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $data = $input['data'] ?? [];

        if (empty($table) || empty($data)) {
            echo json_encode(["error" => "테이블명과 데이터가 필요합니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // Validate columns exist
        $colStmt = $dbConn->query("SHOW COLUMNS FROM `{$table}`");
        $validCols = array_column($colStmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        $insertData = [];
        foreach ($data as $field => $value) {
            if (in_array($field, $validCols)) {
                $insertData[$field] = $value;
            }
        }

        if (empty($insertData)) {
            echo json_encode(["error" => "유효한 컬럼 데이터가 없습니다."]);
            break;
        }

        try {
            $fields = array_keys($insertData);
            $placeholders = array_fill(0, count($fields), '?');
            $values = [];
            foreach ($insertData as $field => $value) {
                $values[] = ($value === '' || $value === '__NULL__') ? null : $value;
            }

            $sql = "INSERT INTO `{$table}` (`" . implode('`, `', $fields) . "`) VALUES (" . implode(', ', $placeholders) . ")";
            $stmt = $dbConn->prepare($sql);
            $result = $stmt->execute($values);
            $newId = $dbConn->lastInsertId();

            echo json_encode([
                "success" => $result,
                "message" => $result ? "행이 추가되었습니다." : "추가 실패",
                "inserted_id" => $newId
            ]);
        } catch (PDOException $e) {
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo json_encode(["error" => '서버 오류가 발생했습니다.']);
        }
        break;

    // ─── Optimize Table ──────────────────────────────────
    case 'optimize_table':
        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $optimizeAll = $input['all'] ?? false;

        try {
            if ($optimizeAll) {
                // Optimize all tables
                $tablesStmt = $dbConn->query("SHOW TABLES");
                $results = [];
                while ($row = $tablesStmt->fetch(PDO::FETCH_NUM)) {
                    $tName = $row[0];
                    // Get size before
                    $beforeStmt = $dbConn->prepare("SELECT ROUND((DATA_LENGTH + INDEX_LENGTH)/1024, 2) AS size_kb FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");
                    $beforeStmt->execute([$dbConfig['name'], $tName]);
                    $beforeSize = floatval($beforeStmt->fetch(PDO::FETCH_ASSOC)['size_kb'] ?? 0);

                    $dbConn->exec("OPTIMIZE TABLE `{$tName}`");

                    // Get size after
                    $afterStmt = $dbConn->prepare("SELECT ROUND((DATA_LENGTH + INDEX_LENGTH)/1024, 2) AS size_kb FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");
                    $afterStmt->execute([$dbConfig['name'], $tName]);
                    $afterSize = floatval($afterStmt->fetch(PDO::FETCH_ASSOC)['size_kb'] ?? 0);

                    $results[] = [
                        'table' => $tName,
                        'before_kb' => $beforeSize,
                        'after_kb' => $afterSize,
                        'saved_kb' => round($beforeSize - $afterSize, 2)
                    ];
                }
                echo json_encode([
                    "success" => true,
                    "message" => count($results) . "개 테이블 최적화 완료",
                    "results" => $results,
                    "total_saved_kb" => round(array_sum(array_column($results, 'saved_kb')), 2)
                ]);
            } else {
                if (empty($table)) {
                    echo json_encode(["error" => "테이블명이 필요합니다."]);
                    break;
                }

                $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
                if (!$checkStmt->fetch()) {
                    echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
                    break;
                }

                // Get size before
                $beforeStmt = $dbConn->prepare("SELECT ROUND((DATA_LENGTH + INDEX_LENGTH)/1024, 2) AS size_kb FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");
                $beforeStmt->execute([$dbConfig['name'], $table]);
                $beforeSize = floatval($beforeStmt->fetch(PDO::FETCH_ASSOC)['size_kb'] ?? 0);

                $dbConn->exec("OPTIMIZE TABLE `{$table}`");

                // Get size after
                $afterStmt = $dbConn->prepare("SELECT ROUND((DATA_LENGTH + INDEX_LENGTH)/1024, 2) AS size_kb FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");
                $afterStmt->execute([$dbConfig['name'], $table]);
                $afterSize = floatval($afterStmt->fetch(PDO::FETCH_ASSOC)['size_kb'] ?? 0);

                echo json_encode([
                    "success" => true,
                    "message" => "`{$table}` 최적화 완료",
                    "table" => $table,
                    "before_kb" => $beforeSize,
                    "after_kb" => $afterSize,
                    "saved_kb" => round($beforeSize - $afterSize, 2)
                ]);
            }
        } catch (PDOException $e) {
            error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
            echo json_encode(["error" => '서버 오류가 발생했습니다.']);
        }
        break;

    // ─── Export Table Data ────────────────────────────────
    case 'export_table':
        $table = $_GET['table'] ?? '';
        $format = $_GET['format'] ?? 'csv';
        $search = $_GET['search'] ?? '';

        if (empty($table)) {
            echo json_encode(["error" => "테이블명이 필요합니다."]);
            break;
        }

        $checkStmt = $dbConn->query("SHOW TABLES LIKE " . $dbConn->quote($table));
        if (!$checkStmt->fetch()) {
            echo json_encode(["error" => "존재하지 않는 테이블입니다."]);
            break;
        }

        // Columns
        $colStmt = $dbConn->query("SHOW COLUMNS FROM `{$table}`");
        $columns = $colStmt->fetchAll(PDO::FETCH_ASSOC);

        // Search
        $whereClause = '';
        $params = [];
        if (!empty($search)) {
            $searchConds = [];
            foreach ($columns as $col) {
                $searchConds[] = "`{$col['Field']}` LIKE ?";
                $params[] = "%{$search}%";
            }
            $whereClause = 'WHERE ' . implode(' OR ', $searchConds);
        }

        // Fetch all matching data (limit 10000 for safety)
        $dataStmt = $dbConn->prepare("SELECT * FROM `{$table}` {$whereClause} LIMIT 10000");
        $dataStmt->execute($params);
        $rows = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

        if ($format === 'csv') {
            header('Content-Type: text/csv; charset=utf-8');
            header("Content-Disposition: attachment; filename=\"{$table}_export.csv\"");
            echo "\xEF\xBB\xBF"; // UTF-8 BOM for Excel

            $output = fopen('php://output', 'w');
            // Header row
            if (!empty($rows)) {
                fputcsv($output, array_keys($rows[0]));
            }
            foreach ($rows as $row) {
                fputcsv($output, $row);
            }
            fclose($output);
        } else {
            header('Content-Type: application/json; charset=utf-8');
            header("Content-Disposition: attachment; filename=\"{$table}_export.json\"");
            echo json_encode([
                'table' => $table,
                'exported_at' => date('Y-m-d H:i:s'),
                'row_count' => count($rows),
                'data' => $rows
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
        exit; // Don't output default JSON after file download

    default:
        echo json_encode(["error" => "올바른 action을 지정해주세요."]);
        break;
}
?>