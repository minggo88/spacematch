<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

// Correct path relative to api/users/
include_once '../db_connect.php';

echo "<h2>🔧 Users 테이블 패치: 프로필 이미지 컬럼 추가</h2>";

try {
    // Check if column exists
    $stmt = $conn->query("SHOW COLUMNS FROM users LIKE 'profile_image'");
    $exists = $stmt->fetch();

    if (!$exists) {
        $sql = "ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL";
        $conn->exec($sql);
        echo "<p style='color: green;'>✅ 'profile_image' 컬럼이 추가되었습니다.</p>";
    } else {
        echo "<p style='color: orange;'>ℹ️ 'profile_image' 컬럼이 이미 존재합니다.</p>";
    }

    echo "<p>이제 이 파일은 삭제하셔도 됩니다.</p>";

} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ 오류: " . $e->getMessage() . "</p>";
}
?>