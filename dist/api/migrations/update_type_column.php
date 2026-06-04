<?php
// DB 연결
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
    die("오류: db_connect.php 파일을 찾을 수 없습니다.");
}

echo "<h2>VENUE 테이블 TYPE 컬럼 업데이트 시작...</h2>";

try {
    // 1. 기존 ENUM 제약 등을 제거하고 VARCHAR(50)으로 변경하여 유연성 확보
    // MySQL에서 MODIFY COLUMN 사용
    $sql = "ALTER TABLE venues MODIFY COLUMN type VARCHAR(50) NOT NULL DEFAULT 'popup'";
    $conn->exec($sql);
    echo "<p style='color:green'>[성공] 'type' 컬럼이 VARCHAR(50)으로 변경되었습니다. 이제 모든 유형의 코드를 저장할 수 있습니다.</p>";

} catch (PDOException $e) {
    error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
    echo "<p style='color:red'>[오류] SQL 실행 중 문제가 발생했습니다: " . $e->getMessage() . "</p>";
}

echo "<h3>작업 완료.</h3>";
?>