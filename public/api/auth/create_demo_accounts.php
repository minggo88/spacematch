<?php
/**
 * 데모 계정 생성 스크립트
 * 배포 후 1회 실행: https://spacematch.net/api/auth/create_demo_accounts.php
 * 실행 후 반드시 이 파일을 삭제하세요!
 */
include_once '../db_connect.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    // 1. is_demo 컬럼 추가 (없으면)
    try {
        $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'is_demo'");
        if ($col_check->rowCount() === 0) {
            $conn->exec("ALTER TABLE users ADD COLUMN is_demo TINYINT(1) DEFAULT 0");
        }
    } catch (PDOException $e) {
        // ignore
    }

    $results = [];

    // 2. 데모 계정 정의
    $demo_accounts = [
        [
            'name' => '데모 셀러',
            'email' => 'demo-seller@spacematch.net',
            'password' => 'demo1234',
            'role' => 'seller',
            'brand_name' => 'Demo Brand',
            'description' => '이 계정은 데모 전용입니다. 기능 체험만 가능합니다.'
        ],
        [
            'name' => '데모 호스트',
            'email' => 'demo-host@spacematch.net',
            'password' => 'demo1234',
            'role' => 'host',
            'brand_name' => 'Demo Venue Provider',
            'description' => '이 계정은 데모 전용입니다. 기능 체험만 가능합니다.'
        ],
        [
            'name' => '데모 관리자',
            'email' => 'demo-admin@spacematch.net',
            'password' => 'demo1234',
            'role' => 'admin',
            'brand_name' => 'SpaceMatch Admin',
            'description' => '이 계정은 데모 전용입니다. 관리자 기능 체험만 가능합니다.'
        ]
    ];

    foreach ($demo_accounts as $account) {
        // 중복 체크
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$account['email']]);

        if ($check->rowCount() > 0) {
            // 이미 존재하면 role, is_demo, description, brand_name을 올바른 값으로 업데이트
            $upd = $conn->prepare("UPDATE users SET role = ?, is_demo = 1, description = ?, brand_name = ?, name = ? WHERE email = ?");
            $upd->execute([$account['role'], $account['description'], $account['brand_name'], $account['name'], $account['email']]);
            $results[] = [
                'email' => $account['email'],
                'role' => $account['role'],
                'status' => 'updated',
                'message' => '기존 계정 업데이트 완료!'
            ];
            continue;
        }

        $password_hash = password_hash($account['password'], PASSWORD_BCRYPT);

        // Dynamically check available columns
        $base_query = "INSERT INTO users (name, email, password, role, status, is_demo";
        $base_values = "(:name, :email, :password, :role, 'active', 1";
        $params = [
            ':name' => $account['name'],
            ':email' => $account['email'],
            ':password' => $password_hash,
            ':role' => $account['role']
        ];

        // Optional columns
        $opt_cols = [
            'brand_name' => $account['brand_name'],
            'description' => $account['description']
        ];

        foreach ($opt_cols as $col => $val) {
            try {
                $col_chk = $conn->query("SHOW COLUMNS FROM users LIKE '{$col}'");
                if ($col_chk->rowCount() > 0) {
                    $base_query .= ", {$col}";
                    $base_values .= ", :{$col}";
                    $params[":{$col}"] = $val;
                }
            } catch (PDOException $e) {
                // skip
            }
        }

        $base_query .= ") VALUES " . $base_values . ")";

        $stmt = $conn->prepare($base_query);
        $stmt->execute($params);

        $results[] = [
            'email' => $account['email'],
            'role' => $account['role'],
            'status' => 'created',
            'message' => '생성 완료!'
        ];
    }

    echo json_encode([
        'success' => true,
        'message' => '데모 계정 처리 완료',
        'results' => $results
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        'message' => '서버 오류가 발생했습니다.'
    ], JSON_UNESCAPED_UNICODE);
}
?>