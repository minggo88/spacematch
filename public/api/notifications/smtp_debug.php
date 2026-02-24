<?php
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'login required']);
    exit();
}

$debug = [];
$smtpUser = 'spacedotmatch@gmail.com';
$smtpPass = 'wjvqapezircvwrgs';

// 유저 이메일 조회
$stmt = $conn->prepare("SELECT email, name FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$debug['to'] = $user['email'] ?? 'none';

// 환경 확인
$debug['openssl'] = extension_loaded('openssl') ? 'yes' : 'NO';
$debug['fsockopen'] = function_exists('fsockopen') ? 'yes' : 'NO';

// SMTP 연결 시도
$sock = @fsockopen('ssl://smtp.gmail.com', 465, $en, $es, 10);
if (!$sock) {
    $debug['connect'] = "FAIL: $es ($en)";
    echo json_encode(['success' => false, 'debug' => $debug], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}
$debug['connect'] = 'OK';

// 응답 읽기
$gr = function () use ($sock) {
    $r = '';
    while ($l = @fgets($sock, 515)) {
        $r .= $l;
        if (substr($l, 3, 1) === ' ')
            break;
    }
    return trim($r);
};

// 명령 전송
$sc = function ($c) use ($sock, $gr) {
    fwrite($sock, $c . "\r\n");
    return $gr();
};

$debug['greet'] = $gr();
$debug['ehlo'] = $sc("EHLO spacematch.net");
$debug['auth'] = $sc("AUTH LOGIN");
$debug['user'] = $sc(base64_encode($smtpUser));
$debug['pass'] = $sc(base64_encode($smtpPass));
$debug['from'] = $sc("MAIL FROM:<$smtpUser>");
$debug['rcpt'] = $sc("RCPT TO:<{$user['email']}>");
$debug['data'] = $sc("DATA");

// 이메일 작성 및 발송
$subj = '=?UTF-8?B?' . base64_encode('SpaceMatch SMTP Test') . '?=';
$body = '<h2>SMTP OK!</h2><p>' . date('Y-m-d H:i:s') . '</p>';

$msg = "From: SpaceMatch <$smtpUser>\r\n";
$msg .= "To: <{$user['email']}>\r\n";
$msg .= "Subject: $subj\r\n";
$msg .= "MIME-Version: 1.0\r\n";
$msg .= "Content-Type: text/html; charset=UTF-8\r\n";
$msg .= "Content-Transfer-Encoding: base64\r\n";
$msg .= "\r\n";
$msg .= chunk_split(base64_encode($body));
$msg .= "\r\n.\r\n";

fwrite($sock, $msg);
$debug['sent'] = $gr();
$debug['quit'] = $sc("QUIT");
fclose($sock);

$ok = strpos($debug['sent'], '250') !== false;
echo json_encode(['success' => $ok, 'debug' => $debug], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>