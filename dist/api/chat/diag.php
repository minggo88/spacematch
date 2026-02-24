<?php
/**
 * Translation Diagnostic — tests translation pipeline on the live server
 * Access: /api/chat/diag.php
 * DELETE AFTER USE!
 */
header('Content-Type: application/json; charset=UTF-8');

$result = ['test' => 'translation diagnostic'];

// Include DB
include_once '../db_connect.php';
if (session_status() === PHP_SESSION_NONE)
    @session_start();

// 1. Check what messages.php version is deployed
$msgsFile = __DIR__ . '/messages.php';
if (file_exists($msgsFile)) {
    $content = file_get_contents($msgsFile);
    // Check for version string
    if (preg_match('/MESSAGES_API_VERSION.*?\'([^\']+)\'/', $content, $m)) {
        $result['messages_version'] = $m[1];
    }
    $result['has_google_translate'] = (strpos($content, 'translate.googleapis.com') !== false) ? 'YES' : 'NO!';
    $result['has_translateMessage'] = (strpos($content, 'function translateMessage') !== false) ? 'YES' : 'NO!';
    $result['google_is_primary'] = (strpos($content, 'Provider 1: Google') !== false) ? 'YES' : 'NO';
}

// 2. Test actual Google Translate: ko → ja
try {
    $testText = '안녕하세요 반갑습니다';
    $gUrl = "https://translate.googleapis.com/translate_a/single?" . http_build_query([
        'client' => 'gtx',
        'sl' => 'ko',
        'tl' => 'ja',
        'dt' => 't',
        'q' => $testText
    ]);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $gUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Mozilla/5.0',
        CURLOPT_HTTPHEADER => ['Accept: application/json']
    ]);
    $gResp = curl_exec($ch);
    $gCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $translatedJa = null;
    if ($gCode === 200 && $gResp) {
        $gData = json_decode($gResp, true);
        if (is_array($gData) && isset($gData[0]) && is_array($gData[0])) {
            $r = '';
            foreach ($gData[0] as $seg) {
                if (isset($seg[0]))
                    $r .= $seg[0];
            }
            $translatedJa = $r;
        }
    }
    $result['google_ko_to_ja'] = [
        'input' => $testText,
        'output' => $translatedJa,
        'http_code' => $gCode,
        'success' => !empty($translatedJa) && $translatedJa !== $testText
    ];
} catch (Throwable $e) {
    $result['google_ko_to_ja'] = 'ERROR: ' . $e->getMessage();
}

// 3. Check existing messages in DB — do they have translations?
if (isset($conn)) {
    try {
        $stmt = $conn->query("
            SELECT id, original_text, original_lang, translated_texts, 
                   LENGTH(translated_texts) as tt_length
            FROM chat_messages 
            ORDER BY id DESC LIMIT 5
        ");
        $msgs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $dbMessages = [];
        foreach ($msgs as $m) {
            $decoded = $m['translated_texts'] ? json_decode($m['translated_texts'], true) : null;
            $dbMessages[] = [
                'id' => $m['id'],
                'original_text' => mb_substr($m['original_text'], 0, 30),
                'original_lang' => $m['original_lang'],
                'has_translations' => !empty($decoded),
                'translation_keys' => $decoded ? array_keys($decoded) : [],
                'tt_length' => $m['tt_length']
            ];
        }
        $result['recent_messages'] = $dbMessages;
    } catch (Throwable $e) {
        $result['db_messages'] = 'ERROR: ' . $e->getMessage();
    }

    // 4. Check user countries in DB
    try {
        $stmt = $conn->query("SELECT id, name, country, role FROM users LIMIT 10");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $result['users'] = $users;
    } catch (Throwable $e) {
        $result['users'] = 'ERROR: ' . $e->getMessage();
    }
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
