<?php
/**
 * Chat Messages API — v6 (2026-02-18 Translation rewrite)
 * 
 * GET  /api/chat/messages.php?conversation_id=N           — Get messages
 * GET  /api/chat/messages.php?conversation_id=N&after_id=M — Polling: new messages only
 * GET  /api/chat/messages.php?version_check=1              — Check deployed version
 * POST /api/chat/messages.php                              — Send message
 *   Body: { "conversation_id": N, "text": "..." }
 * PUT  /api/chat/messages.php                              — Mark messages as read
 *   Body: { "conversation_id": N }
 */

// Quick version check — access ?version_check=1 to confirm deployment
define('MESSAGES_API_VERSION', 'v6-clean-rewrite-2026-02-18');
if (isset($_GET['version_check'])) {
    header('Content-Type: application/json');
    echo json_encode(['version' => MESSAGES_API_VERSION, 'features' => ['google_only', 'no_mymemory', 'all_languages']]);
    exit;
}

include_once '../db_connect.php';
include_once '../notifications/send_email.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "로그인이 필요합니다."]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

// Get user's language
$langStmt = $conn->prepare("SELECT country FROM users WHERE id = ?");
$langStmt->execute([$user_id]);
$userLang = $langStmt->fetchColumn() ?: 'ko';
$userLang = normalizeCountryToLang($userLang); // Ensure 'jp' becomes 'ja', etc.

// ─── Helper: Check if user is participant (admin can access CS convs) ───
function isParticipant($conn, $conversation_id, $user_id)
{
    // Check if direct participant
    $stmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND (participant_1 = ? OR participant_2 = ?)");
    $stmt->execute([$conversation_id, $user_id, $user_id]);
    if ($stmt->fetch() !== false)
        return true;

    // Admin/superadmin can access any CS conversation
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $role = $roleStmt->fetchColumn();
    if (in_array($role, ['admin', 'superadmin'])) {
        $csStmt = $conn->prepare("SELECT id FROM chat_conversations WHERE id = ? AND type = 'cs'");
        $csStmt->execute([$conversation_id]);
        return $csStmt->fetch() !== false;
    }
    return false;
}

// ─── Helper: Get other participant's language ───
function getOtherUserLang($conn, $conversation_id, $sender_id)
{
    $stmt = $conn->prepare("
        SELECT u.country FROM chat_conversations c
        JOIN users u ON u.id = CASE WHEN c.participant_1 = ? THEN c.participant_2 ELSE c.participant_1 END
        WHERE c.id = ?
    ");
    $stmt->execute([$sender_id, $conversation_id]);
    $result = $stmt->fetchColumn();
    if ($result)
        return normalizeCountryToLang($result);

    // Fallback for CS conversations
    $csStmt = $conn->prepare("
        SELECT u.country FROM chat_conversations c
        JOIN users u ON u.id IN (c.participant_1, c.participant_2)
        WHERE c.id = ? AND u.id != ? AND u.role NOT IN ('admin', 'superadmin')
        LIMIT 1
    ");
    $csStmt->execute([$conversation_id, $sender_id]);
    $csResult = $csStmt->fetchColumn();
    if ($csResult)
        return normalizeCountryToLang($csResult);

    return 'ko';
}

// ─── Normalize: country code → Google Translate language code ───
// Single source of truth for ALL language code conversions
function normalizeCountryToLang($input)
{
    $map = [
        // Country codes → language codes
        'jp' => 'ja',
        'kr' => 'ko',
        'vn' => 'vi',
        'cn' => 'zh-CN',
        'kh' => 'km',
        'ua' => 'uk',
        'gb' => 'en',
        'us' => 'en',
        'ca' => 'en',
        // Variant codes → base Google codes
        'en-gb' => 'en',
        'en-ca' => 'en',
        'fr-ca' => 'fr',
    ];
    $lower = strtolower(trim($input));
    return $map[$lower] ?? $lower;
}

// ─── Translate text via Google Translate (single provider, no fallback) ───
function translateMessage($text, $sourceLang, $targetLang)
{
    if (empty($text) || $sourceLang === $targetLang)
        return $text;

    // Normalize both to Google Translate codes
    $src = normalizeCountryToLang($sourceLang);
    $tgt = normalizeCountryToLang($targetLang);
    if ($src === $tgt)
        return $text;

    // ── Cache lookup (optional, never fatal) ──
    global $conn;
    $hash = null;
    try {
        $hash = hash('sha256', $text);
        $cs = $conn->prepare("SELECT translated_text FROM translation_cache WHERE source_hash = ? AND source_lang = ? AND target_lang = ? LIMIT 1");
        $cs->execute([$hash, $src, $tgt]);
        $cached = $cs->fetch(PDO::FETCH_ASSOC);
        if ($cached && !empty($cached['translated_text']) && $cached['translated_text'] !== $text) {
            return $cached['translated_text'];
        }
    } catch (\Throwable $e) { /* cache miss, proceed to translate */
    }

    // ── Google Translate ──
    $translated = null;
    try {
        $url = 'https://translate.googleapis.com/translate_a/single?' . http_build_query([
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
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'Mozilla/5.0',
        ]);
        $resp = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $resp) {
            $data = json_decode($resp, true);
            if (is_array($data) && isset($data[0]) && is_array($data[0])) {
                $result = '';
                foreach ($data[0] as $seg) {
                    if (isset($seg[0]))
                        $result .= $seg[0];
                }
                if (!empty($result) && $result !== $text) {
                    $translated = $result;
                }
            }
        }
    } catch (\Throwable $e) { /* translation failed */
    }

    // ── Cache result ──
    if ($translated) {
        try {
            $hash = $hash ?? hash('sha256', $text);
            $conn->prepare("INSERT INTO translation_cache (source_lang, target_lang, source_text, translated_text, source_hash) VALUES (?, ?, ?, ?, ?)")
                ->execute([$src, $tgt, $text, $translated, $hash]);
        } catch (\Throwable $e) { /* cache is optional */
        }
        return $translated;
    }

    return $text;
}

// ─── GET: Fetch messages ───
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $convId = intval($_GET['conversation_id'] ?? 0);
    $afterId = intval($_GET['after_id'] ?? 0);

    if ($convId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
        exit;
    }

    // Check admin access for CS conversations
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $userRole = $roleStmt->fetchColumn();
    $isAdmin = in_array($userRole, ['admin', 'superadmin']);

    // Check CS type for admin bypass
    $typeStmt = $conn->prepare("SELECT type FROM chat_conversations WHERE id = ?");
    $typeStmt->execute([$convId]);
    $convType = $typeStmt->fetchColumn();

    if (!($isAdmin && $convType === 'cs') && !isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    $query = "
        SELECT m.*, u.name as sender_name, u.profile_image as sender_profile_image, u.country as sender_country
        FROM chat_messages m
        LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
    ";
    $params = [$convId];

    if ($afterId > 0) {
        $query .= " AND m.id > ?";
        $params[] = $afterId;
    }

    $query .= " ORDER BY m.id ASC LIMIT 200";

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse translated_texts JSON
    foreach ($messages as &$msg) {
        if (!empty($msg['translated_texts'])) {
            $msg['translated_texts'] = json_decode($msg['translated_texts'], true);
        } else {
            $msg['translated_texts'] = [];
        }
    }

    // ─── Check for translation updates on recently sent messages ───
    // When polling (after_id > 0), also check if any recent messages 
    // that were previously fetched now have completed translations
    $updatedTranslations = [];
    if ($afterId > 0) {
        $transCheckStmt = $conn->prepare("
            SELECT id, translated_texts FROM chat_messages 
            WHERE conversation_id = ? AND id <= ? AND translated_texts IS NOT NULL
            AND id > ? - 50
            ORDER BY id DESC LIMIT 20
        ");
        $transCheckStmt->execute([$convId, $afterId, $afterId]);
        $recentMsgs = $transCheckStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($recentMsgs as $rm) {
            $decoded = json_decode($rm['translated_texts'], true);
            if (!empty($decoded)) {
                $updatedTranslations[] = [
                    'id' => $rm['id'],
                    'translated_texts' => $decoded
                ];
            }
        }
    }

    echo json_encode([
        "success" => true,
        "messages" => $messages,
        "updated_translations" => $updatedTranslations,
        "viewer_lang" => $userLang
    ]);
    exit;
}

// ─── POST: Send message ───
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $convId = intval($input['conversation_id'] ?? 0);
    $text = trim($input['text'] ?? '');

    if ($convId <= 0 || empty($text)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id와 text는 필수입니다."]);
        exit;
    }

    if (!isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    // ─── STEP 1: Quick translation (receiver's language + English only) ───
    // Only translate to the ESSENTIAL languages synchronously for speed
    $otherLang = getOtherUserLang($conn, $convId, $user_id);
    $translatedTexts = [];
    $translatedTexts[$userLang] = $text; // sender's original

    // Determine core language codes for comparison
    $senderCore = normalizeCountryToLang($userLang);
    $otherCore = normalizeCountryToLang($otherLang);

    // 1) Translate to receiver's language (most important!)
    if ($otherCore !== $senderCore) {
        $translated = translateMessage($text, $userLang, $otherLang);
        if ($translated && $translated !== $text) {
            $translatedTexts[$otherLang] = $translated;
            $translatedTexts[$otherCore] = $translated; // also store by normalized code
        }
    }

    // 2) Also translate to English if neither sender nor receiver is English
    if ($senderCore !== 'en' && $otherCore !== 'en') {
        $enTranslated = translateMessage($text, $userLang, 'en');
        if ($enTranslated && $enTranslated !== $text) {
            $translatedTexts['en'] = $enTranslated;
        }
    }

    // ─── STEP 2: Insert message WITH essential translations ───
    $insertStmt = $conn->prepare("
        INSERT INTO chat_messages (conversation_id, sender_id, message_type, original_text, original_lang, translated_texts)
        VALUES (?, ?, 'text', ?, ?, ?)
    ");
    $insertStmt->execute([
        $convId,
        $user_id,
        $text,
        $userLang,
        !empty($translatedTexts) ? json_encode($translatedTexts, JSON_UNESCAPED_UNICODE) : null
    ]);
    $msgId = intval($conn->lastInsertId());

    // Update conversation last_message_at
    $updateStmt = $conn->prepare("UPDATE chat_conversations SET last_message_at = NOW() WHERE id = ?");
    $updateStmt->execute([$convId]);

    // ─── STEP 3: Respond with the message (includes receiver's translation) ───
    $getStmt = $conn->prepare("
        SELECT m.*, u.name as sender_name, u.profile_image as sender_profile_image, u.country as sender_country
        FROM chat_messages m
        LEFT JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
    ");
    $getStmt->execute([$msgId]);
    $message = $getStmt->fetch(PDO::FETCH_ASSOC);
    if (!empty($message['translated_texts'])) {
        $message['translated_texts'] = json_decode($message['translated_texts'], true);
    }

    $responseJson = json_encode([
        "success" => true,
        "message" => $message,
        "_debug" => [
            "api_version" => MESSAGES_API_VERSION,
            "sender_lang" => $userLang,
            "sender_core" => $senderCore,
            "receiver_lang" => $otherLang,
            "receiver_core" => $otherCore,
            "translated_keys" => array_keys($translatedTexts),
        ]
    ]);

    // Flush response to client, then continue with remaining translations in background
    ignore_user_abort(true);
    header('Content-Type: application/json');
    header('Content-Length: ' . strlen($responseJson));
    header('Connection: close');
    echo $responseJson;
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        ob_end_flush();
        flush();
    }

    // ═══════════════════════════════════════════════════════════════
    // ─── STEP 4: BACKGROUND — Translate remaining languages + notifications ───
    // ═══════════════════════════════════════════════════════════════

    // Translate to ALL remaining languages (best-effort)
    $allLangs = ['ko', 'en', 'ja', 'vi', 'zh-CN', 'th', 'km', 'fr', 'ru', 'uk'];
    $needsUpdate = false;
    foreach ($allLangs as $tgt) {
        if ($tgt === $senderCore)
            continue;
        if (isset($translatedTexts[$tgt]))
            continue;
        $translated = translateMessage($text, $userLang, $tgt);
        if ($translated && $translated !== $text) {
            $translatedTexts[$tgt] = $translated;
            $needsUpdate = true;
        }
    }

    // Update DB with all translations
    if ($needsUpdate) {
        $updateTransStmt = $conn->prepare("UPDATE chat_messages SET translated_texts = ? WHERE id = ?");
        $updateTransStmt->execute([json_encode($translatedTexts, JSON_UNESCAPED_UNICODE), $msgId]);
    }

    // ─── 3b: Create notification + send email ───
    try {
        // Get conversation info to find the other user
        $convInfoStmt = $conn->prepare("SELECT participant_1, participant_2, type FROM chat_conversations WHERE id = ?");
        $convInfoStmt->execute([$convId]);
        $convInfo = $convInfoStmt->fetch(PDO::FETCH_ASSOC);

        if ($convInfo) {
            $other_user_id = ($convInfo['participant_1'] == $user_id) ? $convInfo['participant_2'] : $convInfo['participant_1'];

            // Get sender info
            $senderStmt = $conn->prepare("SELECT name, role FROM users WHERE id = ?");
            $senderStmt->execute([$user_id]);
            $senderInfo = $senderStmt->fetch(PDO::FETCH_ASSOC);
            $senderName = $senderInfo['name'] ?? 'User';
            $senderRole = $senderInfo['role'] ?? '';
            $isSenderAdmin = in_array($senderRole, ['admin', 'superadmin']);

            // Notification message templates per language
            $csNotifTemplates = [
                'ko' => '[CS] {{name}}님이 메시지를 보냈습니다.',
                'en' => '[CS] {{name}} sent a message.',
                'ja' => '[CS] {{name}}さんがメッセージを送信しました。',
                'vi' => '[CS] {{name}} đã gửi tin nhắn.',
                'th' => '[CS] {{name}} ส่งข้อความแล้ว',
                'km' => '[CS] {{name}} បានផ្ញើរសារ។',
                'ru' => '[CS] {{name}} отправил(а) сообщение.',
                'uk' => '[CS] {{name}} надіслав(ла) повідомлення.',
                'fr-CA' => '[CS] {{name}} a envoyé un message.',
                'en-GB' => '[CS] {{name}} sent a message.',
                'en-CA' => '[CS] {{name}} sent a message.',
            ];
            $chatNotifTemplates = [
                'ko' => '{{name}}님이 메시지를 보냈습니다.',
                'en' => '{{name}} sent a message.',
                'ja' => '{{name}}さんがメッセージを送信しました。',
                'vi' => '{{name}} đã gửi tin nhắn.',
                'th' => '{{name}} ส่งข้อความแล้ว',
                'km' => '{{name}} បានផ្ញើរសារ។',
                'ru' => '{{name}} отправил(а) сообщение.',
                'uk' => '{{name}} надіслав(ла) повідомлення.',
                'fr-CA' => '{{name}} a envoyé un message.',
                'en-GB' => '{{name}} sent a message.',
                'en-CA' => '{{name}} sent a message.',
            ];
            // Helper to get notification text in recipient's language
            $getNotifMsg = function ($templates, $recipientLang, $displayName) {
                $baseLang = explode('-', $recipientLang)[0];
                $template = $templates[$recipientLang] ?? $templates[$baseLang] ?? $templates['en'];
                return str_replace('{{name}}', $displayName, $template);
            };

            // Helper: get role-based chat link for a user
            $getLinkForRole = function ($role) {
                if (in_array($role, ['admin', 'superadmin']))
                    return '/admin/cs';
                if ($role === 'host')
                    return '/host/chat';
                return '/seller/chat'; // seller or any other role
            };

            $isCS = ($convInfo['type'] === 'cs');

            if ($isCS) {
                // For CS: admin senders show as "SpaceMatch CS"
                $displayName = $isSenderAdmin ? 'SpaceMatch CS' : $senderName;
                $notifType = 'cs_message';

                // Get recipient's role and language for link and notification text
                $recipientInfoStmt = $conn->prepare("SELECT role, country FROM users WHERE id = ?");
                $recipientInfoStmt->execute([$other_user_id]);
                $recipientInfo = $recipientInfoStmt->fetch(PDO::FETCH_ASSOC);
                $recipientRole = $recipientInfo['role'] ?? 'seller';
                $recipientLang = $recipientInfo['country'] ?? 'ko';
                $notifLink = $getLinkForRole($recipientRole);
                $notifMsg = $getNotifMsg($csNotifTemplates, $recipientLang, $displayName);

                // Insert notification for the direct recipient
                $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$other_user_id, $notifType, $notifMsg, $notifLink]);

                // [EMAIL] CS 메시지 이메일 알림 (다국어)
                try {
                    $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                    $_dn = $displayName;
                    $_tx = $text;
                    $_nl = $notifLink;
                    $_tt = $translatedTexts;
                    sendEmailToUser(
                        $conn,
                        $other_user_id,
                        '',
                        '',
                        'cat_account',
                        function ($lang) use ($_dn, $_tx, $siteUrl, $_nl, $_tt) {
                            $normalizedLang = normalizeCountryToLang($lang);
                            $preview = $_tt[$lang] ?? $_tt[$normalizedLang] ?? $_tx;
                            $subj = _t(['ko' => "[CS] {$_dn}님이 메시지를 보냈습니다", 'en' => "[CS] {$_dn} sent a message", 'ja' => "[CS] {$_dn}さんからメッセージ", 'vi' => "[CS] {$_dn} đã gửi tin nhắn", 'th' => "[CS] {$_dn} ส่งข้อความ"], $lang);
                            return ['subject' => $subj, 'html' => emailTemplateChatMessage($_dn, $preview, true, $siteUrl, $_nl, $lang)];
                        }
                    );
                } catch (Exception $emailErr) {
                    error_log("Email error (cs_message): " . $emailErr->getMessage());
                }

                // If sender is NOT admin, also notify ALL admins
                if (!$isSenderAdmin) {
                    $adminNotifStmt = $conn->prepare("
                        SELECT id, country FROM users 
                        WHERE role IN ('admin', 'superadmin')
                    ");
                    $adminNotifStmt->execute();
                    $allAdmins = $adminNotifStmt->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($allAdmins as $adminRow) {
                        $adminId = $adminRow['id'];
                        if ($adminId != $other_user_id) { // don't double-notify
                            $adminLang = $adminRow['country'] ?? 'ko';
                            $adminNotifMsg = $getNotifMsg($csNotifTemplates, $adminLang, $senderName);
                            $notifStmt->execute([$adminId, $notifType, $adminNotifMsg, '/admin/cs']);
                        }
                    }
                }
            } else {
                // Regular chat message
                $notifType = 'chat_message';

                // Get recipient's role and language
                $recipientInfoStmt2 = $conn->prepare("SELECT role, country FROM users WHERE id = ?");
                $recipientInfoStmt2->execute([$other_user_id]);
                $recipientInfo2 = $recipientInfoStmt2->fetch(PDO::FETCH_ASSOC);
                $recipientRole = $recipientInfo2['role'] ?? 'seller';
                $recipientLang = $recipientInfo2['country'] ?? 'ko';
                $notifLink = $getLinkForRole($recipientRole);
                $notifMsg = $getNotifMsg($chatNotifTemplates, $recipientLang, $senderName);

                $notifStmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)");
                $notifStmt->execute([$other_user_id, $notifType, $notifMsg, $notifLink]);

                // [EMAIL] 채팅 메시지 이메일 알림 (다국어)
                try {
                    $siteUrl = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];
                    $_sn = $senderName;
                    $_tx = $text;
                    $_nl = $notifLink;
                    $_tt = $translatedTexts;
                    sendEmailToUser(
                        $conn,
                        $other_user_id,
                        '',
                        '',
                        'cat_account',
                        function ($lang) use ($_sn, $_tx, $siteUrl, $_nl, $_tt) {
                            $normalizedLang = normalizeCountryToLang($lang);
                            $preview = $_tt[$lang] ?? $_tt[$normalizedLang] ?? $_tx;
                            $subj = _t(['ko' => "{$_sn}님이 메시지를 보냈습니다", 'en' => "{$_sn} sent a message", 'ja' => "{$_sn}さんからメッセージ", 'vi' => "{$_sn} đã gửi tin nhắn", 'th' => "{$_sn} ส่งข้อความ"], $lang);
                            return ['subject' => $subj, 'html' => emailTemplateChatMessage($_sn, $preview, false, $siteUrl, $_nl, $lang)];
                        }
                    );
                } catch (Exception $emailErr) {
                    error_log("Email error (chat_message): " . $emailErr->getMessage());
                }
            }
        }
    } catch (PDOException $e) {
        // Don't fail the message send if notification creation fails
        error_log("Notification creation failed: " . $e->getMessage());
    }

    exit;
}

// ─── PUT: Mark as read ───
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $convId = intval($input['conversation_id'] ?? 0);

    if ($convId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "conversation_id는 필수입니다."]);
        exit;
    }

    if (!isParticipant($conn, $convId, $user_id)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "접근 권한이 없습니다."]);
        exit;
    }

    // Mark all messages from the OTHER user as read
    $stmt = $conn->prepare("UPDATE chat_messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ? AND is_read = 0");
    $stmt->execute([$convId, $user_id]);
    $count = $stmt->rowCount();

    echo json_encode([
        "success" => true,
        "marked_count" => $count
    ]);
    exit;
}

// ─── DELETE: Delete a single message (admin/superadmin only — unsend) ───
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $messageId = intval($input['message_id'] ?? 0);

    if ($messageId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "message_id는 필수입니다."]);
        exit;
    }

    // Check admin role
    $roleStmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $roleStmt->execute([$user_id]);
    $userRole = $roleStmt->fetchColumn();

    if (!in_array($userRole, ['admin', 'superadmin'])) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "관리자만 메시지를 삭제할 수 있습니다."]);
        exit;
    }

    // Verify the message exists and belongs to the current user
    $msgStmt = $conn->prepare("SELECT id, sender_id, file_url FROM chat_messages WHERE id = ?");
    $msgStmt->execute([$messageId]);
    $msg = $msgStmt->fetch(PDO::FETCH_ASSOC);

    if (!$msg) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "메시지를 찾을 수 없습니다."]);
        exit;
    }

    if (intval($msg['sender_id']) !== $user_id) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "자신이 보낸 메시지만 삭제할 수 있습니다."]);
        exit;
    }

    // Delete attached file if exists
    if (!empty($msg['file_url'])) {
        $filePath = $_SERVER['DOCUMENT_ROOT'] . $msg['file_url'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
    }

    // Delete the message
    $delStmt = $conn->prepare("DELETE FROM chat_messages WHERE id = ?");
    $delStmt->execute([$messageId]);

    echo json_encode(["success" => true, "message" => "메시지가 삭제되었습니다."]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Method not allowed"]);
?>