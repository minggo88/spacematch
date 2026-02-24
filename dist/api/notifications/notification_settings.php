<?php
/**
 * 알림 설정 API
 * 
 * === 개인 설정 ===
 * GET:  유저 본인 알림 설정 조회
 * POST: 유저 본인 알림 설정 저장
 * 
 * === Superadmin 전용 관리 ===
 * GET  ?admin=1          : 전체 유저 알림 설정 목록 조회
 * GET  ?admin=1&user_id=N: 특정 유저 알림 설정 조회
 * POST ?admin=1          : 특정 유저 알림 설정 수정 (body에 target_user_id 포함)
 */
include_once '../db_connect.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit();
}

$userId = intval($_SESSION['user_id']);
$userRole = $_SESSION['user_role'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$isAdminMode = isset($_GET['admin']) && $_GET['admin'] == '1';

// ─── 이메일 테스트 (다국어) ───
if (isset($_GET['test_email']) && $_GET['test_email'] == '1') {
    include_once __DIR__ . '/send_email.php';
    header('Content-Type: application/json; charset=utf-8');

    // 유저 이메일 + 국가 조회
    $stmt = $conn->prepare("SELECT email, name, country FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['email'])) {
        echo json_encode(['success' => false, 'message' => '이메일 주소가 등록되지 않았습니다.']);
        exit();
    }

    $lang = _countryToLang($user['country'] ?? 'ko');

    $t = _t([
        'ko' => ['title' => '✅ 이메일 테스트 성공', 'body' => '이 이메일이 보이면 SpaceMatch 이메일 알림 시스템이 정상 작동합니다.', 'subject' => 'SpaceMatch 이메일 테스트'],
        'en' => ['title' => '✅ Email Test Successful', 'body' => 'If you can see this email, SpaceMatch email notifications are working properly.', 'subject' => 'SpaceMatch Email Test'],
        'ja' => ['title' => '✅ メールテスト成功', 'body' => 'このメールが見えれば、SpaceMatchメール通知は正常に動作しています。', 'subject' => 'SpaceMatch メールテスト'],
        'vi' => ['title' => '✅ Test Email Thành Công', 'body' => 'Nếu bạn thấy email này, hệ thống thông báo SpaceMatch đang hoạt động bình thường.', 'subject' => 'SpaceMatch Test Email'],
        'th' => ['title' => '✅ ทดสอบอีเมลสำเร็จ', 'body' => 'หากคุณเห็นอีเมลนี้ ระบบแจ้งเตือน SpaceMatch ทำงานปกติ', 'subject' => 'SpaceMatch ทดสอบอีเมล'],
        'fr' => ['title' => '✅ Test Email Réussi', 'body' => 'Si vous voyez cet email, les notifications SpaceMatch fonctionnent correctement.', 'subject' => 'SpaceMatch Test Email'],
        'km' => ['title' => '✅ សាកល្បងអ៊ីមែលជោគជ័យ', 'body' => 'ប្រសិនបើអ្នកឃើញអ៊ីមែលនេះ ប្រព័ន្ធជូនដំណឹង SpaceMatch កំពុងដំណើរការ។', 'subject' => 'SpaceMatch សាកល្បងអ៊ីមែល'],
        'ru' => ['title' => '✅ Тест email успешен', 'body' => 'Если вы видите это письмо, уведомления SpaceMatch работают корректно.', 'subject' => 'SpaceMatch Тест Email'],
        'uk' => ['title' => '✅ Тест email успішний', 'body' => 'Якщо ви бачите цей лист, сповіщення SpaceMatch працюють коректно.', 'subject' => 'SpaceMatch Тест Email'],
    ], $lang);

    $testHtml = emailBaseTemplate(
        $t['title'],
        "<p style='color: #e0e0f0;'>{$t['body']}</p>
         <div style='background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px 20px; margin: 16px 0;'>
             <p style='margin: 0; color: #34d399; font-size: 14px;'>📧 {$user['email']}</p>
             <p style='margin: 4px 0 0; color: #34d399; font-size: 14px;'>🕐 " . date('Y-m-d H:i:s') . "</p>
             <p style='margin: 4px 0 0; color: #34d399; font-size: 14px;'>🌐 Lang: {$lang}</p>
         </div>",
        null,
        null,
        $lang
    );

    $result = _emailSend($user['email'], $user['name'] ?? '', $t['subject'], $testHtml);

    echo json_encode([
        'success' => $result ? true : false,
        'message' => $result ? "✅ 테스트 이메일이 {$user['email']}으로 발송되었습니다. (lang: {$lang})" : "❌ 이메일 발송에 실패했습니다.",
        'email' => $user['email'],
        'lang' => $lang,
        'country' => $user['country'] ?? 'ko',
    ]);
    exit();
}

// 테이블 자동 생성
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS notification_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        push_enabled TINYINT(1) DEFAULT 1,
        email_enabled TINYINT(1) DEFAULT 1,
        cat_application TINYINT(1) DEFAULT 1,
        cat_community TINYINT(1) DEFAULT 1,
        cat_venue TINYINT(1) DEFAULT 1,
        cat_account TINYINT(1) DEFAULT 1,
        cat_payment TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (PDOException $e) {
    // 이미 존재하면 무시
}

// ─── 기본 필드 목록 ───
$fields = ['push_enabled', 'email_enabled', 'cat_application', 'cat_community', 'cat_venue', 'cat_account', 'cat_payment'];

$defaultSettings = [
    'push_enabled' => 1,
    'email_enabled' => 1,
    'cat_application' => 1,
    'cat_community' => 1,
    'cat_venue' => 1,
    'cat_account' => 1,
    'cat_payment' => 1,
];

// ═══════════════════════════════════════════════
// Superadmin 관리 모드
// ═══════════════════════════════════════════════
if ($isAdminMode) {
    // 권한 체크: superadmin만 허용
    if ($userRole !== 'superadmin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => '슈퍼 관리자만 접근할 수 있습니다.']);
        exit();
    }

    // ─── GET: 전체 유저 알림 설정 목록 또는 특정 유저 조회 ───
    if ($method === 'GET') {
        $targetUserId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

        try {
            if ($targetUserId > 0) {
                // 특정 유저 설정 조회
                $stmt = $conn->prepare("SELECT ns.*, u.name, u.email, u.role 
                    FROM users u
                    LEFT JOIN notification_settings ns ON ns.user_id = u.id
                    WHERE u.id = ?");
                $stmt->execute([$targetUserId]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$row) {
                    echo json_encode(['success' => false, 'message' => '사용자를 찾을 수 없습니다.']);
                    exit();
                }

                // 설정이 없으면 기본값 적용
                foreach ($defaultSettings as $k => $v) {
                    if (!isset($row[$k]) || $row[$k] === null)
                        $row[$k] = $v;
                }

                echo json_encode(['success' => true, 'user_settings' => $row]);
            } else {
                // 전체 유저 목록 + 알림 설정
                $search = isset($_GET['search']) ? trim($_GET['search']) : '';
                $page = max(1, intval($_GET['page'] ?? 1));
                $limit = 20;
                $offset = ($page - 1) * $limit;

                $where = "1=1";
                $params = [];
                if (!empty($search)) {
                    $where .= " AND (u.name LIKE ? OR u.email LIKE ?)";
                    $searchParam = "%{$search}%";
                    $params[] = $searchParam;
                    $params[] = $searchParam;
                }

                // 총 개수
                $countStmt = $conn->prepare("SELECT COUNT(*) FROM users u WHERE {$where}");
                $countStmt->execute($params);
                $total = intval($countStmt->fetchColumn());

                // 유저 목록 + 알림 설정 (LEFT JOIN)
                $stmt = $conn->prepare("
                    SELECT u.id, u.name, u.email, u.role, u.status,
                           COALESCE(ns.push_enabled, 1) as push_enabled,
                           COALESCE(ns.email_enabled, 1) as email_enabled,
                           COALESCE(ns.cat_application, 1) as cat_application,
                           COALESCE(ns.cat_community, 1) as cat_community,
                           COALESCE(ns.cat_venue, 1) as cat_venue,
                           COALESCE(ns.cat_account, 1) as cat_account,
                           COALESCE(ns.cat_payment, 1) as cat_payment,
                           ns.updated_at as settings_updated_at
                    FROM users u
                    LEFT JOIN notification_settings ns ON ns.user_id = u.id
                    WHERE {$where}
                    ORDER BY u.id DESC
                    LIMIT {$limit} OFFSET {$offset}
                ");
                $stmt->execute($params);
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'users' => $users,
                    'total' => $total,
                    'page' => $page,
                    'totalPages' => max(1, ceil($total / $limit)),
                ]);
            }
        } catch (PDOException $e) {
            error_log("Admin notification settings GET error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => '조회 실패']);
        }
    }

    // ─── POST: 특정 유저 알림 설정 수정 ───
    else if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $targetUserId = intval($data['target_user_id'] ?? 0);

        if ($targetUserId <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'target_user_id가 필요합니다.']);
            exit();
        }

        // 유저 존재 확인
        $checkStmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $checkStmt->execute([$targetUserId]);
        if (!$checkStmt->fetch()) {
            echo json_encode(['success' => false, 'message' => '사용자를 찾을 수 없습니다.']);
            exit();
        }

        $values = [];
        foreach ($fields as $f) {
            $values[$f] = isset($data[$f]) ? (intval($data[$f]) ? 1 : 0) : 1;
        }

        try {
            $stmt = $conn->prepare("INSERT INTO notification_settings (user_id, push_enabled, email_enabled, cat_application, cat_community, cat_venue, cat_account, cat_payment)
                VALUES (:uid, :push, :email, :app, :comm, :venue, :acct, :pay)
                ON DUPLICATE KEY UPDATE
                    push_enabled = VALUES(push_enabled),
                    email_enabled = VALUES(email_enabled),
                    cat_application = VALUES(cat_application),
                    cat_community = VALUES(cat_community),
                    cat_venue = VALUES(cat_venue),
                    cat_account = VALUES(cat_account),
                    cat_payment = VALUES(cat_payment),
                    updated_at = NOW()");

            $stmt->execute([
                ':uid' => $targetUserId,
                ':push' => $values['push_enabled'],
                ':email' => $values['email_enabled'],
                ':app' => $values['cat_application'],
                ':comm' => $values['cat_community'],
                ':venue' => $values['cat_venue'],
                ':acct' => $values['cat_account'],
                ':pay' => $values['cat_payment'],
            ]);

            echo json_encode(['success' => true, 'message' => '알림 설정이 저장되었습니다.']);
        } catch (PDOException $e) {
            error_log("Admin notification settings POST error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => '설정 저장 실패']);
        }
    }

    exit();
}

// ═══════════════════════════════════════════════
// 개인 모드 (모든 로그인 유저)
// ═══════════════════════════════════════════════

// ─── GET: 내 알림 설정 조회 ───
if ($method === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT * FROM notification_settings WHERE user_id = ?");
        $stmt->execute([$userId]);
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$settings) {
            $settings = $defaultSettings;
        }

        echo json_encode(['success' => true, 'settings' => $settings]);
    } catch (PDOException $e) {
        error_log("Notification settings GET error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '설정 조회 실패']);
    }
}

// ─── POST: 내 알림 설정 저장 ───
else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => '잘못된 요청입니다.']);
        exit();
    }

    $values = [];
    foreach ($fields as $f) {
        $values[$f] = isset($data[$f]) ? (intval($data[$f]) ? 1 : 0) : 1;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO notification_settings (user_id, push_enabled, email_enabled, cat_application, cat_community, cat_venue, cat_account, cat_payment)
            VALUES (:uid, :push, :email, :app, :comm, :venue, :acct, :pay)
            ON DUPLICATE KEY UPDATE
                push_enabled = VALUES(push_enabled),
                email_enabled = VALUES(email_enabled),
                cat_application = VALUES(cat_application),
                cat_community = VALUES(cat_community),
                cat_venue = VALUES(cat_venue),
                cat_account = VALUES(cat_account),
                cat_payment = VALUES(cat_payment),
                updated_at = NOW()");

        $stmt->execute([
            ':uid' => $userId,
            ':push' => $values['push_enabled'],
            ':email' => $values['email_enabled'],
            ':app' => $values['cat_application'],
            ':comm' => $values['cat_community'],
            ':venue' => $values['cat_venue'],
            ':acct' => $values['cat_account'],
            ':pay' => $values['cat_payment'],
        ]);

        echo json_encode(['success' => true, 'message' => '알림 설정이 저장되었습니다.']);
    } catch (PDOException $e) {
        error_log("Notification settings POST error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '설정 저장 실패']);
    }
}
?>