<?php
/**
 * Chat Translation Debug Endpoint
 * 
 * GET /api/chat/test_translate.php?text=안녕하세요&from=ko&to=ja
 * 
 * Returns detailed debug info about the translation pipeline.
 * For admin/debug use only.
 */

include_once '../db_connect.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

// Version marker - if you see this on the server, the latest PHP is deployed
$VERSION = '2026-02-17-v3-strtoupper-fix';

// ─── Language code mapping (same as messages.php) ───
$LANG_MAP = [
    'ko' => 'ko',
    'en' => 'en',
    'en-GB' => 'en',
    'en-CA' => 'en',
    'fr-CA' => 'fr',
    'fr' => 'fr',
    'ja' => 'ja',
    'vi' => 'vi',
    'zh' => 'zh-CN',
    'th' => 'th',
    'km' => 'km',
    'ru' => 'ru',
    'uk' => 'uk',
    'jp' => 'ja',
    'kr' => 'ko',
    'vn' => 'vi',
    'cn' => 'zh-CN',
    'kh' => 'km',
    'ua' => 'uk',
    'gb' => 'en',
    'ca' => 'en',
    'us' => 'en',
];

$text = $_GET['text'] ?? '안녕하세요. 관리자입니다.';
$from = $_GET['from'] ?? 'ko';
$to = $_GET['to'] ?? 'ja';

$src = $LANG_MAP[$from] ?? substr($from, 0, 2);
$tgt = $LANG_MAP[$to] ?? substr($to, 0, 2);

$debug = [
    'version' => $VERSION,
    'input' => ['text' => $text, 'from' => $from, 'to' => $to],
    'normalized' => ['src' => $src, 'tgt' => $tgt],
    'steps' => [],
];

// Step 1: Check cache
$hash = hash('sha256', $text);
try {
    $cacheStmt = $conn->prepare("SELECT translated_text FROM translation_cache WHERE source_hash = ? AND source_lang = ? AND target_lang = ? LIMIT 1");
    $cacheStmt->execute([$hash, $src, $tgt]);
    $cached = $cacheStmt->fetch(PDO::FETCH_ASSOC);
    if ($cached) {
        $debug['steps'][] = ['step' => 'cache_hit', 'result' => $cached['translated_text']];
        $debug['final_translation'] = $cached['translated_text'];
        echo json_encode($debug, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
    $debug['steps'][] = ['step' => 'cache_miss'];
} catch (Exception $e) {
    $debug['steps'][] = ['step' => 'cache_error', 'error' => $e->getMessage()];
}

// Step 2: Call MyMemory API
$url = "https://api.mymemory.translated.net/get?" . http_build_query([
    'q' => $text,
    'langpair' => "$src|$tgt",
    'de' => 'spacematch@example.com'
]);
$debug['api_url'] = $url;

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => ['Accept: application/json']
]);

$startTime = microtime(true);
$response = curl_exec($ch);
$elapsed = round((microtime(true) - $startTime) * 1000);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

$debug['steps'][] = [
    'step' => 'api_call',
    'http_code' => $httpCode,
    'elapsed_ms' => $elapsed,
    'curl_error' => $curlError ?: null,
    'response_length' => strlen($response),
];

if ($httpCode !== 200 || !$response) {
    $debug['error'] = 'API call failed';
    $debug['final_translation'] = null;
    echo json_encode($debug, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Step 3: Parse response
$data = json_decode($response, true);
$debug['api_response'] = [
    'status' => $data['responseStatus'] ?? null,
    'match' => $data['responseData']['match'] ?? null,
    'translatedText' => $data['responseData']['translatedText'] ?? null,
    'quotaFinished' => $data['quotaFinished'] ?? null,
];

if (isset($data['responseData']['translatedText'])) {
    $translated = $data['responseData']['translatedText'];

    // Step 4: Quality filter (the fixed version)
    $asciiOnly = preg_replace('/[^a-zA-Z]/', '', $translated);
    $isAllCaps = strlen($asciiOnly) > 10 && strtoupper($asciiOnly) === $asciiOnly;

    $debug['steps'][] = [
        'step' => 'quality_filter',
        'ascii_chars' => strlen($asciiOnly),
        'ascii_sample' => substr($asciiOnly, 0, 30),
        'is_all_caps' => $isAllCaps,
        'OLD_strtoupper_would_block' => (strtoupper($translated) === $translated && strlen($translated) > 20),
        'NEW_filter_blocks' => $isAllCaps,
    ];

    if ($isAllCaps) {
        $debug['error'] = 'Filtered as garbage (all-caps Latin text)';
        $debug['final_translation'] = null;
    } else {
        $debug['final_translation'] = $translated;
        $debug['steps'][] = ['step' => 'success'];
    }
} else {
    $debug['error'] = 'No translatedText in API response';
    $debug['final_translation'] = null;
}

echo json_encode($debug, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>