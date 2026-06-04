<?php
// ── 마진율 계산기 트래킹 API ──
// 페이지뷰와 이벤트를 수집하여 DB에 저장
header('Content-Type: application/json; charset=utf-8');

// CORS: 계산기 앱에서의 교차 출처 요청 허용
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../db_connect.php';

// ── 테이블 자동 생성 (첫 실행 시) ──
try {
    $conn->exec("
        CREATE TABLE IF NOT EXISTS calc_page_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(64) NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            device_type ENUM('mobile','desktop','tablet') DEFAULT 'desktop',
            referrer VARCHAR(500),
            page_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created (created_at),
            INDEX idx_ip (ip_address),
            INDEX idx_session (session_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $conn->exec("
        CREATE TABLE IF NOT EXISTS calc_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(64) NOT NULL,
            event_type VARCHAR(50) NOT NULL,
            event_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_type_date (event_type, created_at),
            INDEX idx_session (session_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $conn->exec("
        CREATE TABLE IF NOT EXISTS calc_daily_stats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            stat_date DATE NOT NULL UNIQUE,
            page_views INT DEFAULT 0,
            unique_visitors INT DEFAULT 0,
            calculations INT DEFAULT 0,
            unlock_attempts INT DEFAULT 0,
            conversions INT DEFAULT 0,
            mobile_views INT DEFAULT 0,
            desktop_views INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_date (stat_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
} catch (PDOException $e) {
    // 이미 존재하면 무시
}

$data = json_decode(file_get_contents('php://input'), true);
$type = isset($data['type']) ? trim($data['type']) : '';
$sessionId = isset($data['session_id']) ? trim($data['session_id']) : '';

if (empty($type) || empty($sessionId)) {
    echo json_encode(['success' => false, 'message' => 'type과 session_id 필수']);
    exit();
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

// 디바이스 타입 판별
function detectDevice($ua)
{
    $ua = strtolower($ua);
    if (preg_match('/tablet|ipad|playbook|silk/i', $ua))
        return 'tablet';
    if (preg_match('/mobile|android|iphone|ipod|phone|webos|blackberry/i', $ua))
        return 'mobile';
    return 'desktop';
}

$deviceType = isset($data['device_type']) ? $data['device_type'] : detectDevice($userAgent);

try {
    if ($type === 'pageview') {
        // ── 페이지뷰 기록 ──
        $referrer = isset($data['referrer']) ? substr($data['referrer'], 0, 500) : '';
        $pageUrl = isset($data['page_url']) ? substr($data['page_url'], 0, 500) : '';

        $stmt = $conn->prepare("
            INSERT INTO calc_page_views (session_id, ip_address, user_agent, device_type, referrer, page_url)
            VALUES (:sid, :ip, :ua, :device, :ref, :url)
        ");
        $stmt->execute([
            ':sid' => $sessionId,
            ':ip' => $ip,
            ':ua' => $userAgent,
            ':device' => $deviceType,
            ':ref' => $referrer,
            ':url' => $pageUrl
        ]);

        // 일별 통계 업데이트
        $deviceCol = ($deviceType === 'mobile') ? 'mobile_views' : 'desktop_views';
        $conn->exec("
            INSERT INTO calc_daily_stats (stat_date, page_views, {$deviceCol})
            VALUES (CURDATE(), 1, 1)
            ON DUPLICATE KEY UPDATE
                page_views = page_views + 1,
                {$deviceCol} = {$deviceCol} + 1
        ");

        // 고유 방문자 업데이트 (IP 기준, 하루에 1회만)
        $uvCheck = $conn->prepare("
            SELECT COUNT(*) FROM calc_page_views
            WHERE ip_address = :ip AND DATE(created_at) = CURDATE() AND id < LAST_INSERT_ID()
        ");
        $uvCheck->execute([':ip' => $ip]);
        if ($uvCheck->fetchColumn() == 0) {
            $conn->exec("
                INSERT INTO calc_daily_stats (stat_date, unique_visitors)
                VALUES (CURDATE(), 1)
                ON DUPLICATE KEY UPDATE unique_visitors = unique_visitors + 1
            ");
        }

        echo json_encode(['success' => true, 'recorded' => 'pageview']);

    } elseif ($type === 'event') {
        // ── 이벤트 기록 ──
        $eventType = isset($data['event_type']) ? trim($data['event_type']) : '';
        $eventData = isset($data['event_data']) ? json_encode($data['event_data']) : null;

        if (empty($eventType)) {
            echo json_encode(['success' => false, 'message' => 'event_type 필수']);
            exit();
        }

        $stmt = $conn->prepare("
            INSERT INTO calc_events (session_id, event_type, event_data)
            VALUES (:sid, :type, :data)
        ");
        $stmt->execute([
            ':sid' => $sessionId,
            ':type' => $eventType,
            ':data' => $eventData
        ]);

        // 일별 통계 업데이트
        $colMap = [
            'calculate' => 'calculations',
            'unlock_attempt' => 'unlock_attempts',
            'conversion' => 'conversions'
        ];

        if (isset($colMap[$eventType])) {
            $col = $colMap[$eventType];
            $conn->exec("
                INSERT INTO calc_daily_stats (stat_date, {$col})
                VALUES (CURDATE(), 1)
                ON DUPLICATE KEY UPDATE {$col} = {$col} + 1
            ");
        }

        echo json_encode(['success' => true, 'recorded' => $eventType]);

    } else {
        echo json_encode(['success' => false, 'message' => '알 수 없는 type: ' . $type]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '서버 오류가 발생했습니다.']);
}
?>