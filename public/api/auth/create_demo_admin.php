<?php
/**
 * 어드민 데모 계정 생성 스크립트
 * 1회 실행 후 반드시 삭제하세요!
 */
include_once '../db_connect.php';

header('Content-Type: application/json; charset=UTF-8');

try {
    // is_demo 컬럼 확인
    try {
        $col_check = $conn->query("SHOW COLUMNS FROM users LIKE 'is_demo'");
        if ($col_check->rowCount() === 0) {
            $conn->exec("ALTER TABLE users ADD COLUMN is_demo TINYINT(1) DEFAULT 0");
        }
    } catch (PDOException $e) {
        // ignore
    }

    $email = 'demo-admin@spacematch.net';

    // 중복 체크
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => '어드민 데모 계정이 이미 존재합니다.',
            'email' => $email
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $password_hash = password_hash('demo1234', PASSWORD_BCRYPT);

    $base_query = "INSERT INTO users (name, email, password, role, status, is_demo";
    $base_values = "(:name, :email, :password, :role, 'active', 1";
    $params = [
        ':name' => '데모 관리자',
        ':email' => $email,
        ':password' => $password_hash,
        ':role' => 'admin'
    ];

    // Optional columns
    $opt_cols = [
        'brand_name' => 'SpaceMatch Admin',
        'description' => '이 계정은 데모 전용입니다. 관리자 기능 체험만 가능합니다.'
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

    echo json_encode([
        'success' => true,
        'message' => '어드민 데모 계정 생성 완료!',
        'email' => $email,
        'role' => 'admin'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '오류: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>