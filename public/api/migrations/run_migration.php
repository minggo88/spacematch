<?php
// DB 연결 파일 포함 (경로 확인 필요: 이 파일이 public/api/migrations/ 에 위치한다고 가정)
// public/api/migrations/run_migration.php -> ../../../db_connect.php (X)
// 보통 public/api 에 db_connect.php가 없으면 상위나 ../db_connect.php 등을 찾음
// 기존 api 파일들이 ../db_connect.php를 쓰므로, 이 파일이 public/api/migrations/ 안에 있다면 ../../db_connect.php 가 맞을 수 있음.
// 안전하게 여러 경로 시도

$paths = [
    '../../db_connect.php',
    '../db_connect.php',
    'db_connect.php'
];

$conn = null;
foreach ($paths as $path) {
    if (file_exists($path)) {
        include_once $path;
        echo "DB 연결 파일 찾음: $path <br>";
        break;
    }
}

if (!$conn) {
    die("오류: db_connect.php 파일을 찾을 수 없습니다. 경로를 확인해주세요.");
}

echo "<h2>데이터베이스 업데이트 시작...</h2>";

try {
    // 1. 컬럼이 이미 있는지 확인
    $checkQuery = "SHOW COLUMNS FROM venues LIKE 'pricing_unit'";
    $stmt = $conn->prepare($checkQuery);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo "<p style='color:blue'>[알림] 'pricing_unit' 컬럼이 이미 존재합니다. 추가 작업을 건너뜁니다.</p>";
    } else {
        // 2. 컬럼 추가 실행
        $sql = "ALTER TABLE venues ADD COLUMN pricing_unit ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily' AFTER price";
        $conn->exec($sql);
        echo "<p style='color:green'>[성공] 'pricing_unit' 컬럼이 성공적으로 추가되었습니다!</p>";
    }

} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "<p style='color:red'>[오류] SQL 실행 중 문제가 발생했습니다: " . $e->getMessage() . "</p>";
}

echo "<h3>작업 완료. 이 파일을 서버에서 삭제해주세요.</h3>";
?>