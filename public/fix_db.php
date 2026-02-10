<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

// Include DB connection
$db_paths = ['api/db_connect.php', 'db_connect.php', '../db_connect.php'];
$conn = null;
foreach ($db_paths as $path) {
    if (file_exists($path)) {
        include_once $path;
        if (isset($conn))
            break;
    }
}

if (!$conn) {
    die("❌ db_connect.php 파일을 찾을 수 없습니다. api 폴더 안에 있는지 확인해주세요.");
}

echo "<h2>🔧 데이터베이스 긴급 복구 도구</h2>";

function checkAndAddColumn($conn, $table, $column, $definition)
{
    try {
        $stmt = $conn->query("SHOW COLUMNS FROM $table LIKE '$column'");
        $exists = $stmt->fetch();
        if (!$exists) {
            $conn->exec("ALTER TABLE $table ADD COLUMN $column $definition");
            echo "<p style='color: green;'>✅ '$table' 테이블에 '$column' 컬럼 추가 완료.</p>";
        } else {
            echo "<p style='color: blue;'>ℹ️ '$table' 테이블에 '$column' 컬럼이 이미 존재합니다.</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: red;'>❌ '$column' 컬럼 확인 중 오류: " . $e->getMessage() . "</p>";
    }
}

// 1. Fix Users table (Add profile_image)
echo "<h3>1. 사용자 테이블 점검</h3>";
checkAndAddColumn($conn, 'users', 'profile_image', 'VARCHAR(255) DEFAULT NULL');
checkAndAddColumn($conn, 'users', 'business_no', 'VARCHAR(50) DEFAULT NULL');
checkAndAddColumn($conn, 'users', 'venue_limit', 'INT DEFAULT 3');

// 2. Fix Applications table structure if needed
echo "<h3>2. 신청(Applications) 테이블 점검</h3>";
try {
    $stmt = $conn->query("SHOW COLUMNS FROM applications");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('user_id', $columns) && in_array('seller_id', $columns)) {
        echo "<p style='color: orange;'>⚠️ applications 테이블 구조가 구버전입니다. 수정을 시도합니다...</p>";
        // Drop and recreate logic from previous fix
        $conn->exec("DROP TABLE IF EXISTS applications");
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
        echo "<p style='color: green;'>✅ applications 테이블 재생성 완료.</p>";
    } else {
        echo "<p style='color: blue;'>ℹ️ applications 테이블 구조가 정상입니다.</p>";
    }
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ applications 테이블 점검 중 오류: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2 style='color: green;'>✅ 모든 점검이 완료되었습니다.</h2>";
echo "<p>이제 로그인을 다시 시도해보세요.</p>";
echo "<p><strong>주의: 확인 후 이 파일(fix_db.php)은 서버에서 삭제해주세요.</strong></p>";
?>