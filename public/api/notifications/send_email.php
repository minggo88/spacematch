<?php
/**
 * 이메일 알림 발송 함수 (다국어 지원)
 * 
 * 사용법:
 *   include_once __DIR__ . '/send_email.php';
 * 
 *   // 기존 방식 (하위 호환)
 *   sendEmailToUser($conn, $userId, '제목', '<h1>HTML 내용</h1>');
 * 
 *   // 다국어 방식 (콜백)
 *   sendEmailToUser($conn, $userId, '제목', '<h1>내용</h1>', 'cat_application',
 *       function($lang) use ($sellerName, $venueName, $siteUrl) {
 *           return ['subject' => ..., 'html' => emailTemplateApplicationNew($sellerName, $venueName, false, $siteUrl, $lang)];
 *       }
 *   );
 */

include_once __DIR__ . '/email_templates.php';

/**
 * 특정 유저에게 이메일 발송
 * @param string|null $category 카테고리 키 (cat_application, cat_community 등)
 * @param callable|null $langCallback function($lang) => ['subject' => ..., 'html' => ...] 다국어 콜백
 * @return array ['sent' => int, 'failed' => int]
 */
function sendEmailToUser($conn, $userId, $subject, $htmlBody, $category = null, $langCallback = null)
{
    return sendEmailToUsers($conn, [$userId], $subject, $htmlBody, $category, $langCallback);
}

/**
 * 여러 유저에게 이메일 발송
 * @param string|null $category 카테고리 키
 * @param callable|null $langCallback function($lang) => ['subject' => ..., 'html' => ...] 다국어 콜백
 * @return array ['sent' => int, 'failed' => int]
 */
function sendEmailToUsers($conn, $userIds, $subject, $htmlBody, $category = null, $langCallback = null)
{
    if (empty($userIds))
        return ['sent' => 0, 'failed' => 0];

    $sent = 0;
    $failed = 0;

    try {
        // 유저 이메일 + 국가 조회
        $placeholders = implode(',', array_fill(0, count($userIds), '?'));
        $stmt = $conn->prepare("SELECT id, email, name, country FROM users WHERE id IN ($placeholders) AND email IS NOT NULL AND email != ''");
        $stmt->execute($userIds);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($users)) {
            return ['sent' => 0, 'failed' => 0, 'info' => '이메일 주소 없음'];
        }

        // 각 유저 알림 설정 확인 후 발송
        foreach ($users as $u) {
            // 알림 설정 확인 (email_enabled + 카테고리별 확인)
            if (!_emailIsEnabled($conn, $u['id'], $category)) {
                continue;
            }

            // 다국어 콜백이 있으면 유저 언어에 맞게 이메일 생성
            $userSubject = $subject;
            $userHtml = $htmlBody;

            if ($langCallback && is_callable($langCallback)) {
                $lang = _countryToLang($u['country'] ?? 'ko');
                try {
                    $result = $langCallback($lang);
                    if (isset($result['subject']))
                        $userSubject = $result['subject'];
                    if (isset($result['html']))
                        $userHtml = $result['html'];
                } catch (Exception $e) {
                    error_log("Lang callback error: " . $e->getMessage());
                }
            }

            $result = _emailSend($u['email'], $u['name'] ?? '', $userSubject, $userHtml);
            if ($result) {
                $sent++;
            } else {
                $failed++;
            }
        }

    } catch (Exception $e) {
        error_log("Email send error: " . $e->getMessage());
    }

    return ['sent' => $sent, 'failed' => $failed];
}

/**
 * 유저의 이메일 알림 활성화 여부 확인
 * @param string|null $category 카테고리 키 (예: 'cat_community'). null이면 email_enabled만 확인.
 */
function _emailIsEnabled($conn, $userId, $category = null)
{
    try {
        $cols = 'email_enabled';
        if ($category && preg_match('/^cat_[a-z]+$/', $category)) {
            $cols .= ", {$category}";
        }
        $stmt = $conn->prepare("SELECT {$cols} FROM notification_settings WHERE user_id = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // 설정 없으면 기본적으로 활성화 (opt-out 방식)
        if (!$row)
            return true;
        // 전체 이메일 OFF이면 미발송
        if (!(bool) $row['email_enabled'])
            return false;
        // 카테고리별 확인
        if ($category && isset($row[$category]) && !(bool) $row[$category])
            return false;
        return true;
    } catch (Exception $e) {
        // 테이블 없을 수도 있음 — 기본 활성화
        return true;
    }
}

/**
 * 실제 이메일 발송 (Gmail SMTP 직접 연결)
 */
function _emailSend($to, $name, $subject, $htmlBody)
{
    $smtpHost = 'ssl://smtp.gmail.com';
    $smtpPort = 465;
    $smtpUser = 'spacedotmatch@gmail.com';
    $smtpPass = 'wjvqapezircvwrgs';
    $fromName = 'SpaceMatch';

    try {
        // SMTP 서버 연결
        $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 10);
        if (!$socket) {
            error_log("SMTP connect failed: $errstr ($errno)");
            return false;
        }

        // 응답 읽기 헬퍼
        $getResp = function () use ($socket) {
            $resp = '';
            while ($line = @fgets($socket, 515)) {
                $resp .= $line;
                if (substr($line, 3, 1) === ' ')
                    break;
            }
            return $resp;
        };

        // 명령 전송 헬퍼
        $sendCmd = function ($cmd) use ($socket, $getResp) {
            fwrite($socket, $cmd . "\r\n");
            return $getResp();
        };

        // SMTP 대화
        $getResp(); // 220 인사
        $sendCmd("EHLO spacematch.net");
        $sendCmd("AUTH LOGIN");
        $sendCmd(base64_encode($smtpUser));
        $authResp = $sendCmd(base64_encode($smtpPass));

        if (strpos($authResp, '235') === false) {
            error_log("SMTP AUTH failed: $authResp");
            fclose($socket);
            return false;
        }

        $sendCmd("MAIL FROM:<$smtpUser>");
        $rcptResp = $sendCmd("RCPT TO:<$to>");
        if (strpos($rcptResp, '250') === false) {
            error_log("SMTP RCPT failed: $rcptResp");
            fclose($socket);
            return false;
        }

        $sendCmd("DATA");

        // 이메일 헤더 + 본문
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFrom = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

        $msg = "From: $encodedFrom <$smtpUser>\r\n";
        $msg .= $name
            ? "To: =?UTF-8?B?" . base64_encode($name) . "?= <$to>\r\n"
            : "To: <$to>\r\n";
        $msg .= "Subject: $encodedSubject\r\n";
        $msg .= "MIME-Version: 1.0\r\n";
        $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
        $msg .= "Content-Transfer-Encoding: base64\r\n";
        $msg .= "\r\n";
        $msg .= chunk_split(base64_encode($htmlBody));
        $msg .= "\r\n.\r\n";

        fwrite($socket, $msg);
        $dataResp = $getResp();

        $sendCmd("QUIT");
        fclose($socket);

        $success = strpos($dataResp, '250') !== false;
        if (!$success) {
            error_log("SMTP DATA failed for {$to}: $dataResp");
        }
        return $success;

    } catch (Exception $e) {
        error_log("SMTP error: " . $e->getMessage());
        return false;
    }
}
?>