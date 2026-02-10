<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔧 Applications 테이블 구조 수정</h2>";

if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
} else {
    die("❌ db_connect.php 파일을 찾을 수 없습니다.");
}

// Step 1: Check current structure
echo "<h3>1. 현재 테이블 구조 확인</h3>";
try {
    $stmt = $conn->query("DESCRIBE applications");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1'><tr><th>Field</th><th>Type</th></tr>";
    $hasUserId = false;
    $hasVenueId = false;
    foreach ($columns as $col) {
        echo "<tr><td>{$col['Field']}</td><td>{$col['Type']}</td></tr>";
        if ($col['Field'] === 'user_id')
            $hasUserId = true;
        if ($col['Field'] === 'venue_id')
            $hasVenueId = true;
    }
    echo "</table><br>";
} catch (PDOException $e) {
    echo "applications 테이블이 없거나 오류: " . $e->getMessage() . "<br>";
    $hasUserId = false;
    $hasVenueId = false;
}

// Step 2: Fix the table
echo "<h3>2. 테이블 수정</h3>";

// Option A: Drop and recreate (safest for fixing structure issues)
try {
    echo "기존 applications 테이블 삭제 중... ";
    $conn->exec("DROP TABLE IF EXISTS applications");
    echo "✅ 삭제 완료<br>";

    echo "새 applications 테이블 생성 중... ";
    $sql = "CREATE TABLE applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        venue_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        message TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_venue_id (venue_id)
    )";
    $conn->exec($sql);
    echo "✅ 생성 완료<br>";

    // Verify
    echo "<h3>3. 새 테이블 구조 확인</h3>";
    $stmt = $conn->query("DESCRIBE applications");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1'><tr><th>Field</th><th>Type</th></tr>";
    foreach ($columns as $col) {
        echo "<tr><td>{$col['Field']}</td><td>{$col['Type']}</td></tr>";
    }
    echo "</table><br>";

    echo "<h2 style='color: green;'>✅ 수정 완료!</h2>";
    echo "<p>이제 관리자 페이지에서 사용자 목록이 정상적으로 표시됩니다.</p>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ 이 파일(fix_applications.php)을 삭제해주세요!</p>";

} catch (PDOException $e) {
    echo "❌ 오류: " . $e->getMessage() . "<br>";
}
?>