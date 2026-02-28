<?php
/**
 * API 접근 진단 테스트
 * 브라우저에서 /api/users/api_test.php 로 접근하여 확인
 */
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
$phpVersion = phpversion();
$postMaxSize = ini_get('post_max_size');
$maxExecTime = ini_get('max_execution_time');
$memoryLimit = ini_get('memory_limit');

// Check if seller_stats.php exists in same directory
$sellerStatsExists = file_exists(__DIR__ . '/seller_stats.php');
$sellerStatsImportExists = file_exists(__DIR__ . '/seller_stats_import.php');
$dbConnectExists = file_exists(__DIR__ . '/../db_connect.php');

echo json_encode([
    "success" => true,
    "message" => "API is accessible!",
    "method" => $method,
    "php_version" => $phpVersion,
    "post_max_size" => $postMaxSize,
    "max_execution_time" => $maxExecTime,
    "memory_limit" => $memoryLimit,
    "seller_stats_exists" => $sellerStatsExists,
    "seller_stats_import_exists" => $sellerStatsImportExists,
    "db_connect_exists" => $dbConnectExists,
    "document_root" => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    "script_filename" => $_SERVER['SCRIPT_FILENAME'] ?? 'N/A',
    "server_software" => $_SERVER['SERVER_SOFTWARE'] ?? 'N/A',
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>