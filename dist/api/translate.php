<?php
/**
 * SpaceMatch Translation API
 * Adapter pattern: MyMemory (free) → Google / DeepL swappable
 * 
 * POST /api/translate.php
 * Body: { "texts": ["안녕하세요", "감사합니다"], "source": "ko", "target": "en" }
 * Response: { "success": true, "translations": ["Hello", "Thank you"] }
 */

include_once 'db_connect.php';

// ─── Create translation cache table ───
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS translation_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source_lang VARCHAR(5) NOT NULL,
        target_lang VARCHAR(5) NOT NULL,
        source_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        source_hash VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_hash_langs (source_hash, source_lang, target_lang)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // Table might already exist
}

// ─── Add country columns to users if not exist ───
try {
    $conn->query("SELECT country FROM users LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE users ADD COLUMN country VARCHAR(5) DEFAULT NULL AFTER instagram");
}
try {
    $conn->query("SELECT space_country FROM users LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE users ADD COLUMN space_country VARCHAR(5) DEFAULT NULL AFTER country");
}

// ─── Add original_lang to community tables ───
try {
    $conn->query("SELECT original_lang FROM community_posts LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE community_posts ADD COLUMN original_lang VARCHAR(5) DEFAULT NULL AFTER content");
}
try {
    $conn->query("SELECT original_lang FROM community_comments LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE community_comments ADD COLUMN original_lang VARCHAR(5) DEFAULT NULL AFTER content");
}

// ─── Add original_lang to applications ───
try {
    $conn->query("SELECT original_lang FROM applications LIMIT 1");
} catch (PDOException $e) {
    $conn->exec("ALTER TABLE applications ADD COLUMN original_lang VARCHAR(5) DEFAULT NULL AFTER message");
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// ─── Parse request ───
$input = json_decode(file_get_contents('php://input'), true);
$texts = $input['texts'] ?? [];
$source = $input['source'] ?? '';
$target = $input['target'] ?? '';

if (empty($texts) || empty($source) || empty($target)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing texts, source, or target"]);
    exit;
}

if ($source === $target) {
    echo json_encode(["success" => true, "translations" => $texts]);
    exit;
}

// Limit batch size
if (count($texts) > 20) {
    $texts = array_slice($texts, 0, 20);
}

// ─── Language code mapping for MyMemory ───
function normalizeForMyMemory($langCode)
{
    $map = [
        'ko' => 'ko',
        'en' => 'en',
        'en-GB' => 'en',
        'en-CA' => 'en',
        'fr-CA' => 'fr',
        'ja' => 'ja',
        'vi' => 'vi',
        'th' => 'th',
        'km' => 'km',
        'ru' => 'ru',
        'uk' => 'uk',
    ];
    return $map[$langCode] ?? substr($langCode, 0, 2);
}

// ─── Check cache first ───
function getCached($conn, $sourceHash, $sourceLang, $targetLang)
{
    $stmt = $conn->prepare("SELECT translated_text FROM translation_cache WHERE source_hash = ? AND source_lang = ? AND target_lang = ? LIMIT 1");
    $stmt->execute([$sourceHash, $sourceLang, $targetLang]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row['translated_text'] : null;
}

function setCache($conn, $sourceLang, $targetLang, $sourceText, $translatedText, $sourceHash)
{
    try {
        $stmt = $conn->prepare("INSERT INTO translation_cache (source_lang, target_lang, source_text, translated_text, source_hash) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$sourceLang, $targetLang, $sourceText, $translatedText, $sourceHash]);
    } catch (PDOException $e) {
        // Ignore duplicate or other errors
    }
}

// ─── Google Translate free endpoint (fallback) ───
function translateWithGoogle($text, $src, $tgt)
{
    $url = "https://translate.googleapis.com/translate_a/single?" . http_build_query([
        'client' => 'gtx',
        'sl' => $src,
        'tl' => $tgt,
        'dt' => 't',
        'q' => $text
    ]);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'Mozilla/5.0',
        CURLOPT_HTTPHEADER => ['Accept: application/json']
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($httpCode !== 200 || !$response)
        return null;
    $data = json_decode($response, true);
    if (is_array($data) && isset($data[0]) && is_array($data[0])) {
        $result = '';
        foreach ($data[0] as $seg) {
            if (isset($seg[0]))
                $result .= $seg[0];
        }
        return !empty($result) ? $result : null;
    }
    return null;
}

// ─── Translate using MyMemory API + Google fallback ───
function translateWithMyMemory($text, $sourceLang, $targetLang)
{
    $src = normalizeForMyMemory($sourceLang);
    $tgt = normalizeForMyMemory($targetLang);

    // ── Provider 1: MyMemory ──
    $url = "https://api.mymemory.translated.net/get?" . http_build_query([
        'q' => $text,
        'langpair' => "$src|$tgt",
        'de' => 'spacematch@example.com'
    ]);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Accept: application/json']
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if (isset($data['responseData']['translatedText'])) {
            $translated = $data['responseData']['translatedText'];
            $match = $data['responseData']['match'] ?? 0;
            $quotaFinished = $data['quotaFinished'] ?? false;
            $asciiOnly = preg_replace('/[^a-zA-Z]/', '', $translated);
            $isGarbage = strlen($asciiOnly) > 10 && strtoupper($asciiOnly) === $asciiOnly;
            if (!$isGarbage && $match >= 0.3 && !$quotaFinished && $translated !== $text) {
                return $translated;
            }
        }
    }

    // ── Provider 2: Google Translate (fallback) ──
    $googleResult = translateWithGoogle($text, $src, $tgt);
    if ($googleResult && $googleResult !== $text) {
        return $googleResult;
    }

    return null;
}

// ─── Process each text ───
$translations = [];
$srcNorm = normalizeForMyMemory($source);
$tgtNorm = normalizeForMyMemory($target);

foreach ($texts as $text) {
    $text = trim($text);

    // Skip empty strings
    if (empty($text)) {
        $translations[] = $text;
        continue;
    }

    // Check cache
    $hash = hash('sha256', $text);
    $cached = getCached($conn, $hash, $srcNorm, $tgtNorm);

    if ($cached !== null) {
        $translations[] = $cached;
        continue;
    }

    // Call API
    $translated = translateWithMyMemory($text, $source, $target);

    if ($translated !== null) {
        setCache($conn, $srcNorm, $tgtNorm, $text, $translated, $hash);
        $translations[] = $translated;
    } else {
        // Fallback: return original text
        $translations[] = $text;
    }

    // Small delay between API calls to avoid rate limiting
    usleep(100000); // 100ms
}

echo json_encode([
    "success" => true,
    "translations" => $translations,
    "source" => $source,
    "target" => $target
]);
?>