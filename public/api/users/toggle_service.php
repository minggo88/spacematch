<?php
/**
 * toggle_service.php
 * 
 * Admin API to toggle user service permissions:
 * - analytics_report (for vendors)
 * - popular_alerts (for sellers)
 * - priority_application (for sellers)
 * 
 * POST body: { user_id, service, enabled, start_date?, end_date? }
 * GET: ?user_id=123 → returns all service permissions for the user
 */
include_once '../db_connect.php';
session_start();
header('Content-Type: application/json');
error_reporting(E_ERROR);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => '로그인이 필요합니다.']);
    exit;
}

$role = $_SESSION['user_role'] ?? '';
if (!in_array($role, ['admin', 'superadmin'])) {
    echo json_encode(['success' => false, 'message' => '관리자 권한이 필요합니다.']);
    exit;
}

// Auto-create table
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS user_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service VARCHAR(50) NOT NULL,
        enabled TINYINT(1) DEFAULT 0,
        start_date DATE DEFAULT NULL,
        end_date DATE DEFAULT NULL,
        auto_apply TINYINT(1) DEFAULT 0,
        monthly_limit INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_service (user_id, service),
        INDEX (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) { /* table exists */
}

// Auto-migrate: add new columns
try {
    $conn->exec("ALTER TABLE user_services ADD COLUMN auto_apply TINYINT(1) DEFAULT 0");
} catch (Exception $e) {
}
try {
    $conn->exec("ALTER TABLE user_services ADD COLUMN monthly_limit INT DEFAULT 0");
} catch (Exception $e) {
}

// Auto-create fasttrack_usage table
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS fasttrack_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_id INT NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (used_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (Exception $e) {
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET: Fetch all services for a user
    $user_id = intval($_GET['user_id'] ?? 0);
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => '사용자 ID가 필요합니다.']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT service, enabled, start_date, end_date, auto_apply, monthly_limit FROM user_services WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get this month's fasttrack usage
        $monthStart = date('Y-m-01');
        $usageStmt = $conn->prepare("SELECT COUNT(*) FROM fasttrack_usage WHERE user_id = ? AND used_at >= ?");
        $usageStmt->execute([$user_id, $monthStart]);
        $monthlyUsed = intval($usageStmt->fetchColumn());

        $services = [];
        foreach ($rows as $r) {
            $svc = [
                'enabled' => intval($r['enabled']),
                'start_date' => $r['start_date'],
                'end_date' => $r['end_date']
            ];
            if ($r['service'] === 'priority_application') {
                $svc['auto_apply'] = intval($r['auto_apply'] ?? 0);
                $svc['monthly_limit'] = intval($r['monthly_limit'] ?? 0);
                $svc['monthly_used'] = $monthlyUsed;
            }
            $services[$r['service']] = $svc;
        }

        echo json_encode(['success' => true, 'services' => $services]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    // POST: Toggle a service for a user
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = intval($data['user_id'] ?? 0);
    $service = $data['service'] ?? '';
    $enabled = intval($data['enabled'] ?? 0);
    $start_date = $data['start_date'] ?? null;
    $end_date = $data['end_date'] ?? null;
    $auto_apply = intval($data['auto_apply'] ?? 0);
    $monthly_limit = intval($data['monthly_limit'] ?? 0);

    $validServices = ['analytics_report', 'popular_alerts', 'priority_application'];

    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => '사용자 ID가 필요합니다.']);
        exit;
    }
    if (!in_array($service, $validServices)) {
        echo json_encode(['success' => false, 'message' => '유효하지 않은 서비스입니다.']);
        exit;
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO user_services (user_id, service, enabled, start_date, end_date, auto_apply, monthly_limit) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), start_date = VALUES(start_date), end_date = VALUES(end_date), auto_apply = VALUES(auto_apply), monthly_limit = VALUES(monthly_limit)
        ");
        $stmt->execute([$user_id, $service, $enabled, $start_date ?: null, $end_date ?: null, $auto_apply, $monthly_limit]);

        $serviceLabels = [
            'analytics_report' => '분석 리포트',
            'popular_alerts' => '인기 공간 알림',
            'priority_application' => '입점 신청 우선권'
        ];

        echo json_encode([
            'success' => true,
            'message' => ($serviceLabels[$service] ?? $service) . ($enabled ? ' 서비스가 활성화되었습니다.' : ' 서비스가 비활성화되었습니다.'),
            'service' => $service,
            'enabled' => $enabled
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => '지원하지 않는 요청 메서드입니다.']);
?>