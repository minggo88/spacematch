<?php
/**
 * Translation API Test Script
 * Run: php test_translate.php
 */

echo "=== SpaceMatch Translation API Test ===\n\n";

// Test 1: Direct MyMemory API call
echo "[Test 1] MyMemory API Direct Call (ko→en: '안녕하세요')\n";
$url = "https://api.mymemory.translated.net/get?" . http_build_query([
    'q' => '안녕하세요',
    'langpair' => 'ko|en',
    'de' => 'spacematch@example.com'
]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => ['Accept: application/json']
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

echo "  HTTP Code: $httpCode\n";
if ($curlError) {
    echo "  cURL Error: $curlError\n";
} else {
    $data = json_decode($response, true);
    if (isset($data['responseData']['translatedText'])) {
        echo "  Result: '" . $data['responseData']['translatedText'] . "'\n";
        echo "  ✅ MyMemory API is working!\n";
    } else {
        echo "  ❌ Unexpected response:\n";
        echo "  " . substr($response, 0, 500) . "\n";
    }
}

echo "\n";

// Test 2: Try en→ko
echo "[Test 2] MyMemory API Direct Call (en→ko: 'Hello, how are you?')\n";
$url2 = "https://api.mymemory.translated.net/get?" . http_build_query([
    'q' => 'Hello, how are you?',
    'langpair' => 'en|ko',
    'de' => 'spacematch@example.com'
]);

$ch2 = curl_init();
curl_setopt_array($ch2, [
    CURLOPT_URL => $url2,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => ['Accept: application/json']
]);

$response2 = curl_exec($ch2);
$httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
$curlError2 = curl_error($ch2);
curl_close($ch2);

echo "  HTTP Code: $httpCode2\n";
if ($curlError2) {
    echo "  cURL Error: $curlError2\n";
} else {
    $data2 = json_decode($response2, true);
    if (isset($data2['responseData']['translatedText'])) {
        echo "  Result: '" . $data2['responseData']['translatedText'] . "'\n";
        echo "  ✅ Reverse translation working!\n";
    } else {
        echo "  ❌ Unexpected response:\n";
        echo "  " . substr($response2, 0, 500) . "\n";
    }
}

echo "\n";

// Test 3: Check if DB connection works and translation_cache table exists
echo "[Test 3] DB Connection & Cache Table Check\n";
try {
    include_once __DIR__ . '/db_connect.php';
    echo "  ✅ DB Connection OK\n";

    // Check translation_cache table
    try {
        $result = $conn->query("SELECT COUNT(*) as cnt FROM translation_cache");
        $row = $result->fetch(PDO::FETCH_ASSOC);
        echo "  ✅ translation_cache table exists ({$row['cnt']} entries)\n";
    } catch (PDOException $e) {
        echo "  ⚠️ translation_cache table not found (will be created on first translate.php call)\n";
    }

    // Check users.country column
    try {
        $result = $conn->query("SELECT COUNT(*) as cnt FROM users WHERE country IS NOT NULL");
        $row = $result->fetch(PDO::FETCH_ASSOC);
        echo "  ✅ users.country column exists ({$row['cnt']} users with country set)\n";
    } catch (PDOException $e) {
        echo "  ⚠️ users.country column not found yet\n";
    }

    // Check community_posts.original_lang column
    try {
        $result = $conn->query("SELECT COUNT(*) as total, COUNT(original_lang) as with_lang FROM community_posts");
        $row = $result->fetch(PDO::FETCH_ASSOC);
        echo "  ✅ community_posts.original_lang exists (total: {$row['total']}, with lang: {$row['with_lang']})\n";
        if ($row['total'] > 0 && $row['with_lang'] == 0) {
            echo "  ⚠️ No posts have original_lang set — existing posts need default 'ko'\n";
        }
    } catch (PDOException $e) {
        echo "  ⚠️ community_posts.original_lang column not found yet\n";
    }

    // Check community_comments.original_lang column
    try {
        $result = $conn->query("SELECT COUNT(*) as total, COUNT(original_lang) as with_lang FROM community_comments");
        $row = $result->fetch(PDO::FETCH_ASSOC);
        echo "  ✅ community_comments.original_lang exists (total: {$row['total']}, with lang: {$row['with_lang']})\n";
    } catch (PDOException $e) {
        echo "  ⚠️ community_comments.original_lang column not found yet\n";
    }

} catch (Exception $e) {
    echo "  ❌ DB Error: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
?>