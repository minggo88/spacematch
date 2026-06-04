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

// ─── Helper: scan directory for files ───
function scanDir($dir, $pattern = '*', $maxAgeSec = 0)
{
    $files = [];
    $totalSize = 0;
    $count = 0;

    if (!is_dir($dir) || !is_readable($dir)) {
        return ['count' => 0, 'size' => 0, 'files' => [], 'error' => 'Directory inaccessible'];
    }

    $items = glob($dir . '/' . $pattern);
    if ($items === false)
        $items = [];

    foreach ($items as $item) {
        if (!is_file($item))
            continue;
        $mtime = filemtime($item);
        $size = filesize($item);

        // If maxAge is set, only count files older than that
        if ($maxAgeSec > 0 && (time() - $mtime) < $maxAgeSec)
            continue;

        $count++;
        $totalSize += $size;
        if ($count <= 20) { // Only list first 20 for preview
            $files[] = [
                'name' => basename($item),
                'size' => $size,
                'modified' => date('Y-m-d H:i:s', $mtime),
                'age_hours' => round((time() - $mtime) / 3600, 1)
            ];
        }
    }

    return ['count' => $count, 'size' => $totalSize, 'files' => $files];
}

// ─── Helper: format bytes ───
function formatBytes($bytes)
{
    if ($bytes >= 1073741824)
        return round($bytes / 1073741824, 2) . ' GB';
    if ($bytes >= 1048576)
        return round($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024)
        return round($bytes / 1024, 2) . ' KB';
    return $bytes . ' B';
}

// ─── Helper: delete files by pattern ───
function deleteFiles($dir, $pattern = '*', $maxAgeSec = 0)
{
    $deleted = 0;
    $freedBytes = 0;
    $errors = [];

    if (!is_dir($dir) || !is_readable($dir)) {
        return ['deleted' => 0, 'freed' => 0, 'errors' => ['Directory inaccessible']];
    }

    $items = glob($dir . '/' . $pattern);
    if ($items === false)
        $items = [];

    foreach ($items as $item) {
        if (!is_file($item))
            continue;

        if ($maxAgeSec > 0 && (time() - filemtime($item)) < $maxAgeSec)
            continue;

        $size = filesize($item);
        if (@unlink($item)) {
            $deleted++;
            $freedBytes += $size;
        } else {
            $errors[] = basename($item);
        }
    }

    return ['deleted' => $deleted, 'freed' => $freedBytes, 'errors' => $errors];
}

switch ($action) {
    // ─── Scan all cache types ─────────────────────────────
    case 'scan':
        $result = [];

        // 1. PHP Sessions (expired, older than 24 hours)
        $sessionPath = session_save_path();
        if (empty($sessionPath))
            $sessionPath = sys_get_temp_dir();
        $sessionScan = scanDir($sessionPath, 'sess_*', 86400); // 24h old
        $result['sessions'] = [
            'label' => 'PHP 세션 (만료)',
            'labelEn' => 'Expired PHP Sessions',
            'icon' => 'users',
            'path' => $sessionPath,
            'count' => $sessionScan['count'],
            'size' => $sessionScan['size'],
            'sizeFormatted' => formatBytes($sessionScan['size']),
            'files' => $sessionScan['files'],
            'description' => '24시간 이상 된 세션 파일',
            'descriptionEn' => 'Session files older than 24 hours'
        ];

        // 2. OPcache
        $opcacheStatus = function_exists('opcache_get_status') ? @opcache_get_status(false) : null;
        $result['opcache'] = [
            'label' => 'PHP OPcache',
            'labelEn' => 'PHP OPcache',
            'icon' => 'cpu',
            'available' => $opcacheStatus !== false && $opcacheStatus !== null,
            'count' => $opcacheStatus ? ($opcacheStatus['opcache_statistics']['num_cached_scripts'] ?? 0) : 0,
            'size' => $opcacheStatus ? ($opcacheStatus['memory_usage']['used_memory'] ?? 0) : 0,
            'sizeFormatted' => $opcacheStatus ? formatBytes($opcacheStatus['memory_usage']['used_memory'] ?? 0) : '0 B',
            'hitRate' => $opcacheStatus ? round($opcacheStatus['opcache_statistics']['opcache_hit_rate'] ?? 0, 1) : 0,
            'description' => 'PHP 바이트코드 캐시 리셋',
            'descriptionEn' => 'Reset PHP bytecode cache'
        ];

        // 3. Temp files (older than 6 hours)
        $tempDir = sys_get_temp_dir();
        $tempScan = scanDir($tempDir, 'php*', 21600); // 6h old
        $result['temp'] = [
            'label' => '임시 파일',
            'labelEn' => 'Temp Files',
            'icon' => 'file-x',
            'path' => $tempDir,
            'count' => $tempScan['count'],
            'size' => $tempScan['size'],
            'sizeFormatted' => formatBytes($tempScan['size']),
            'files' => $tempScan['files'],
            'description' => '6시간 이상 된 PHP 임시 파일',
            'descriptionEn' => 'PHP temp files older than 6 hours'
        ];

        // 4. Error logs
        $projectRoot = realpath(__DIR__ . '/../../');
        $logScan = scanDir($projectRoot, '*.log', 0);
        // Also check for error_log files
        $errorLogScan = scanDir($projectRoot, 'error_log*', 0);
        $logCount = $logScan['count'] + $errorLogScan['count'];
        $logSize = $logScan['size'] + $errorLogScan['size'];
        $logFiles = array_merge($logScan['files'], $errorLogScan['files']);

        // Scan api subdirectories for error_log files
        $apiDir = realpath(__DIR__ . '/../');
        if ($apiDir) {
            $subDirs = glob($apiDir . '/*', GLOB_ONLYDIR);
            foreach ($subDirs as $subDir) {
                $subLogScan = scanDir($subDir, 'error_log*', 0);
                $logCount += $subLogScan['count'];
                $logSize += $subLogScan['size'];
                foreach ($subLogScan['files'] as &$f) {
                    $f['name'] = basename($subDir) . '/' . $f['name'];
                }
                $logFiles = array_merge($logFiles, $subLogScan['files']);
            }
        }

        $result['logs'] = [
            'label' => '에러 로그',
            'labelEn' => 'Error Logs',
            'icon' => 'file-text',
            'count' => $logCount,
            'size' => $logSize,
            'sizeFormatted' => formatBytes($logSize),
            'files' => array_slice($logFiles, 0, 20),
            'description' => '서버 에러 로그 파일',
            'descriptionEn' => 'Server error log files'
        ];

        // 5. Trash bin (older than 30 days)
        try {
            $trashStmt = $conn->query("SELECT COUNT(*) as cnt FROM trash_bin WHERE deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
            $trashCount = intval($trashStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

            $trashTotalStmt = $conn->query("SELECT COUNT(*) as cnt FROM trash_bin");
            $trashTotal = intval($trashTotalStmt->fetch(PDO::FETCH_ASSOC)['cnt']);

            $trashSizeStmt = $conn->query("SELECT SUM(LENGTH(record_data)) as total FROM trash_bin WHERE deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
            $trashSize = intval($trashSizeStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);
        } catch (PDOException $e) {
            $trashCount = 0;
            $trashTotal = 0;
            $trashSize = 0;
        }

        $result['trash'] = [
            'label' => '휴지통 (30일+)',
            'labelEn' => 'Trash Bin (30d+)',
            'icon' => 'trash-2',
            'count' => $trashCount,
            'totalCount' => $trashTotal,
            'size' => $trashSize,
            'sizeFormatted' => formatBytes($trashSize),
            'description' => '30일 이상된 휴지통 기록',
            'descriptionEn' => 'Trash records older than 30 days'
        ];

        // Summary
        $totalSize = 0;
        $totalCount = 0;
        foreach (['sessions', 'temp', 'logs', 'trash'] as $k) {
            $totalSize += $result[$k]['size'];
            $totalCount += $result[$k]['count'];
        }
        $totalSize += $result['opcache']['size'];

        echo json_encode([
            'success' => true,
            'caches' => $result,
            'totalSize' => $totalSize,
            'totalSizeFormatted' => formatBytes($totalSize),
            'totalCount' => $totalCount
        ]);
        break;

    // ─── Clear specific cache type ────────────────────────
    case 'clear':
        $type = $_POST['type'] ?? ($_GET['type'] ?? '');
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($type) && $input)
            $type = $input['type'] ?? '';

        if (empty($type)) {
            echo json_encode(["error" => "삭제할 캐시 유형을 지정해주세요."]);
            break;
        }

        $results = [];
        $types = $type === 'all' ? ['sessions', 'opcache', 'temp', 'logs', 'trash'] : [$type];

        foreach ($types as $t) {
            switch ($t) {
                case 'sessions':
                    $sessionPath = session_save_path();
                    if (empty($sessionPath))
                        $sessionPath = sys_get_temp_dir();
                    $r = deleteFiles($sessionPath, 'sess_*', 86400);
                    $results['sessions'] = [
                        'deleted' => $r['deleted'],
                        'freed' => $r['freed'],
                        'freedFormatted' => formatBytes($r['freed']),
                        'errors' => count($r['errors'])
                    ];
                    break;

                case 'opcache':
                    if (function_exists('opcache_reset')) {
                        $success = @opcache_reset();
                        $results['opcache'] = [
                            'success' => $success,
                            'message' => $success ? 'OPcache reset successful' : 'OPcache reset failed'
                        ];
                    } else {
                        $results['opcache'] = ['success' => false, 'message' => 'OPcache not available'];
                    }
                    break;

                case 'temp':
                    $tempDir = sys_get_temp_dir();
                    $r = deleteFiles($tempDir, 'php*', 21600);
                    $results['temp'] = [
                        'deleted' => $r['deleted'],
                        'freed' => $r['freed'],
                        'freedFormatted' => formatBytes($r['freed']),
                        'errors' => count($r['errors'])
                    ];
                    break;

                case 'logs':
                    $projectRoot = realpath(__DIR__ . '/../../');
                    $r1 = deleteFiles($projectRoot, '*.log', 0);
                    $r2 = deleteFiles($projectRoot, 'error_log*', 0);

                    $totalDeleted = $r1['deleted'] + $r2['deleted'];
                    $totalFreed = $r1['freed'] + $r2['freed'];

                    // Also clean subdirectory error_logs
                    $apiDir = realpath(__DIR__ . '/../');
                    if ($apiDir) {
                        $subDirs = glob($apiDir . '/*', GLOB_ONLYDIR);
                        foreach ($subDirs as $subDir) {
                            $sr = deleteFiles($subDir, 'error_log*', 0);
                            $totalDeleted += $sr['deleted'];
                            $totalFreed += $sr['freed'];
                        }
                    }

                    $results['logs'] = [
                        'deleted' => $totalDeleted,
                        'freed' => $totalFreed,
                        'freedFormatted' => formatBytes($totalFreed),
                        'errors' => count($r1['errors']) + count($r2['errors'])
                    ];
                    break;

                case 'trash':
                    try {
                        $stmt = $conn->prepare("DELETE FROM trash_bin WHERE deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
                        $stmt->execute();
                        $affected = $stmt->rowCount();

                        // Optimize table after deletion
                        $conn->exec("OPTIMIZE TABLE trash_bin");

                        $results['trash'] = [
                            'deleted' => $affected,
                            'message' => "{$affected}개 휴지통 기록 삭제 완료"
                        ];
                    } catch (PDOException $e) {
                        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
                        $results['trash'] = ['deleted' => 0, 'error' => '서버 오류가 발생했습니다.'];
                    }
                    break;

                default:
                    $results[$t] = ['error' => '알 수 없는 캐시 유형'];
                    break;
            }
        }

        echo json_encode([
            'success' => true,
            'results' => $results,
            'message' => '캐시 정리 완료'
        ]);
        break;

    default:
        echo json_encode(["error" => "올바른 action을 지정해주세요. (scan / clear)"]);
        break;
}
?>