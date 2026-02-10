<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>🔧 Applications Table Migration</h3>";

if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
} elseif (file_exists('db_connect.php')) {
    include_once 'db_connect.php';
} else {
    die("❌ Error: Could not find db_connect.php.");
}

try {
    echo "Creating 'applications' table... ";
    $sql = "CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        venue_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
    )";
    $conn->exec($sql);
    echo "✅ Done.<br>";

    echo "<h2 style='color: green;'>✅ Migration Complete!</h2>";
    echo "<p>이제 관리자 페이지에서 사용자 목록이 정상적으로 보일 것입니다.</p>";
    echo "<p style='color: red; font-weight: bold;'>⚠️ 실행 후 이 파일(migrate_applications.php)을 삭제해주세요!</p>";

} catch (PDOException $e) {
    echo "<h1>❌ Fatal Error</h1>" . $e->getMessage();
}
?>