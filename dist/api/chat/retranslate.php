<?php
/**
 * Re-translate messages — DEBUG version
 * DELETE AFTER USE!
 */
header('Content-Type: application/json; charset=UTF-8');
set_time_limit(120);
include_once '../db_connect.php';

$result = ['task' => 'retranslate debug'];

// Get ALL messages
$stmt = $conn->query("SELECT id, original_text, original_lang, translated_texts FROM chat_messages ORDER BY id ASC");
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

$updated = 0;
$details = [];

foreach ($messages as $msg) {
    $translations = $msg['translated_texts'] ? json_decode($msg['translated_texts'], true) : [];
    if (!is_array($translations))
        $translations = [];

    $existingKeys = array_keys($translations);
    $sourceLang = $msg['original_lang'] ?: 'ko';

    // Target languages to ensure
    $targets = ['ko', 'en', 'ja', 'vi', 'zh-CN', 'th', 'km', 'fr', 'ru', 'uk'];
    $missing = [];
    $added = [];

    foreach ($targets as $tgt) {
        if ($tgt === $sourceLang)
            continue;
        if (isset($translations[$tgt]))
            continue;
        $missing[] = $tgt;

        // Translate via Google
        try {
            $url = 'https://translate.googleapis.com/translate_a/single?' . http_build_query([
                'client' => 'gtx',
                'sl' => $sourceLang,
                'tl' => $tgt,
                'dt' => 't',
                'q' => $msg['original_text']
            ]);
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_USERAGENT => 'Mozilla/5.0'
            ]);
            $resp = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $resp) {
                $data = json_decode($resp, true);
                if (is_array($data) && isset($data[0]) && is_array($data[0])) {
                    $r = '';
                    foreach ($data[0] as $seg) {
                        if (isset($seg[0]))
                            $r .= $seg[0];
                    }
                    if (!empty($r)) {
                        $translations[$tgt] = $r;
                        $added[] = $tgt;
                    }
                }
            }
            usleep(50000); // 50ms delay
        } catch (Throwable $e) {
            // skip
        }
    }

    if (!empty($added)) {
        $updateStmt = $conn->prepare("UPDATE chat_messages SET translated_texts = ? WHERE id = ?");
        $updateStmt->execute([json_encode($translations, JSON_UNESCAPED_UNICODE), $msg['id']]);
        $updated++;
    }

    $details[] = [
        'id' => $msg['id'],
        'text' => mb_substr($msg['original_text'], 0, 20),
        'lang' => $sourceLang,
        'had' => $existingKeys,
        'missing' => $missing,
        'added' => $added,
        'now_has' => array_keys($translations)
    ];
}

$result['total'] = count($messages);
$result['updated'] = $updated;
$result['details'] = $details;

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
