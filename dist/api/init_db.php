<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

include_once 'db_connect.php';

echo "<h2>🚀 SpaceMatch DB 초기화 스크립트</h2>";
echo "<hr>";

// ==============================
// 1. 모든 테이블 생성
// ==============================
$tables = [
    'users' => "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        real_name VARCHAR(100) NULL,
        business_no VARCHAR(50) NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'seller',
        status VARCHAR(20) DEFAULT 'active',
        profile_image VARCHAR(500) NULL,
        brand_name VARCHAR(100) NULL,
        brand_description TEXT NULL,
        description TEXT NULL,
        instagram VARCHAR(200) NULL,
        product_category VARCHAR(100) NULL,
        custom_category VARCHAR(100) NULL,
        category VARCHAR(100) NULL,
        keywords TEXT NULL,
        venue_limit INT DEFAULT 50,
        marketing_agreed TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'venues' => "CREATE TABLE IF NOT EXISTS venues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NULL,
        location VARCHAR(500) NULL,
        region VARCHAR(100) NULL,
        description TEXT NULL,
        images TEXT NULL,
        price VARCHAR(100) NULL,
        event_start VARCHAR(50) NULL,
        event_end VARCHAR(50) NULL,
        event_periods TEXT NULL,
        size VARCHAR(50) NULL,
        max_sellers INT DEFAULT 0,
        commission_rate DECIMAL(5,2) DEFAULT 0,
        avg_sales VARCHAR(100) NULL,
        popular_categories TEXT NULL,
        latitude DECIMAL(10,7) NULL,
        longitude DECIMAL(10,7) NULL,
        status VARCHAR(20) DEFAULT 'active',
        recruitment_deadline VARCHAR(50) NULL,
        recruitment_closed TINYINT DEFAULT 0,
        day_price VARCHAR(100) NULL,
        week_price VARCHAR(100) NULL,
        month_price VARCHAR(100) NULL,
        deposit VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_owner (owner_id),
        INDEX idx_status (status),
        INDEX idx_region (region)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'applications' => "CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        user_id INT NULL,
        seller_id INT NULL,
        seller_name VARCHAR(100) NULL,
        venue_name VARCHAR(200) NULL,
        brand_name VARCHAR(100) NULL,
        category VARCHAR(100) NULL,
        message TEXT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_venue (venue_id),
        INDEX idx_seller (seller_id),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'notifications' => "CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(500) NULL,
        is_read TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_read (is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'venue_types' => "CREATE TABLE IF NOT EXISTS venue_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) NOT NULL,
        is_active TINYINT DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'venue_wishlist' => "CREATE TABLE IF NOT EXISTS venue_wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        venue_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wish (user_id, venue_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'venue_promotions' => "CREATE TABLE IF NOT EXISTS venue_promotions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venue_id INT NOT NULL,
        slot_position VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_venue (venue_id),
        INDEX idx_dates (start_date, end_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'seller_photos' => "CREATE TABLE IF NOT EXISTS seller_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(200) NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_posts' => "CREATE TABLE IF NOT EXISTS community_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        user_name VARCHAR(100) NULL,
        user_role VARCHAR(20) NULL,
        profile_image VARCHAR(500) NULL,
        community_type VARCHAR(50) DEFAULT 'general',
        label VARCHAR(50) NULL,
        title VARCHAR(300) NULL,
        content TEXT NOT NULL,
        keywords TEXT NULL,
        like_count INT DEFAULT 0,
        comment_count INT DEFAULT 0,
        view_count INT DEFAULT 0,
        is_deleted TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type (community_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_comments' => "CREATE TABLE IF NOT EXISTS community_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        parent_id INT NULL,
        user_id INT NOT NULL,
        user_name VARCHAR(100) NULL,
        user_role VARCHAR(20) NULL,
        profile_image VARCHAR(500) NULL,
        content TEXT NOT NULL,
        like_count INT DEFAULT 0,
        is_deleted TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post (post_id),
        INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_post_photos' => "CREATE TABLE IF NOT EXISTS community_post_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        INDEX idx_post (post_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_post_likes' => "CREATE TABLE IF NOT EXISTS community_post_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (post_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_post_views' => "CREATE TABLE IF NOT EXISTS community_post_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_view (post_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'community_comment_likes' => "CREATE TABLE IF NOT EXISTS community_comment_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        comment_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (comment_id, user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'cancellation_requests' => "CREATE TABLE IF NOT EXISTS cancellation_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        seller_id INT NOT NULL,
        venue_id INT NOT NULL,
        reason TEXT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        admin_note TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_app (application_id),
        INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'banned_users' => "CREATE TABLE IF NOT EXISTS banned_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NULL,
        phone VARCHAR(20) NULL,
        business_no VARCHAR(50) NULL,
        reason TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'ads' => "CREATE TABLE IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slot_id VARCHAR(50) NOT NULL,
        title VARCHAR(200) NULL,
        image_url VARCHAR(500) NULL,
        click_url VARCHAR(500) NULL,
        start_date DATE NULL,
        end_date DATE NULL,
        is_active TINYINT DEFAULT 1,
        priority INT DEFAULT 0,
        click_count INT DEFAULT 0,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    'adsense_config' => "CREATE TABLE IF NOT EXISTS adsense_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id VARCHAR(100) NULL,
        slot_configs TEXT NULL,
        is_enabled TINYINT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

$success = 0;
$errors = 0;

foreach ($tables as $name => $sql) {
    try {
        $conn->exec($sql);
        echo "✅ <b>$name</b> — OK<br>";
        $success++;
    } catch (PDOException $e) {
        error_log('[' . basename(__FILE__, '.php') . '] ' . $e->getMessage());
        echo "❌ <b>$name</b> — " . $e->getMessage() . "<br>";
        $errors++;
    }
}

echo "<hr>";
echo "<h3>📊 결과: $success 성공 / $errors 실패</h3>";

// ==============================
// 2. Super Admin 계정 생성/확인
// ==============================
echo "<hr><h3>👤 Super Admin 계정</h3>";

$admin_email = 'copydot.thomaspaik@gmail.com';
$admin_password = 'Fuckoff91!@';
$admin_name = 'paik7777';
$admin_phone = '010-7568-1753';

$check = $conn->prepare("SELECT id, role, status FROM users WHERE email = ?");
$check->execute([$admin_email]);

if ($check->rowCount() > 0) {
    $row = $check->fetch(PDO::FETCH_ASSOC);
    echo "ℹ️ 이미 존재 (ID: {$row['id']}, Role: {$row['role']}, Status: {$row['status']})<br>";

    if ($row['role'] !== 'superadmin' || $row['status'] !== 'active') {
        $conn->prepare("UPDATE users SET role = 'superadmin', status = 'active' WHERE email = ?")
            ->execute([$admin_email]);
        echo "✅ 역할/상태 업데이트 완료<br>";
    }
} else {
    $hash = password_hash($admin_password, PASSWORD_BCRYPT);
    $conn->prepare("INSERT INTO users (name, email, password, role, status, phone) VALUES (?, ?, ?, 'superadmin', 'active', ?)")
        ->execute([$admin_name, $admin_email, $hash, $admin_phone]);
    echo "✅ Super Admin 생성 완료!<br>";
}

echo "<br><b>로그인 정보:</b><br>";
echo "Email: $admin_email<br>";
echo "Password: $admin_password<br>";

// ==============================
// 3. 기본 venue_types 데이터
// ==============================
echo "<hr><h3>🏷️ 베뉴 타입 데이터</h3>";

$typeCheck = $conn->query("SELECT COUNT(*) FROM venue_types");
$typeCount = $typeCheck->fetchColumn();

if ($typeCount == 0) {
    $defaultTypes = [
        ['백화점', 'department'],
        ['쇼핑몰', 'mall'],
        ['복합문화공간', 'complex'],
        ['카페/레스토랑', 'cafe'],
        ['호텔/리조트', 'hotel'],
        ['오피스', 'office'],
        ['갤러리', 'gallery'],
        ['팝업스토어', 'popup'],
        ['기타', 'other']
    ];
    $stmt = $conn->prepare("INSERT INTO venue_types (name, code, is_active) VALUES (?, ?, 1)");
    foreach ($defaultTypes as $t) {
        $stmt->execute($t);
    }
    echo "✅ 기본 " . count($defaultTypes) . "개 타입 생성<br>";
} else {
    echo "ℹ️ 이미 {$typeCount}개 존재<br>";
}

// ==============================
// 4. 전체 테이블 목록 확인
// ==============================
echo "<hr><h3>📋 현재 DB 테이블 목록</h3>";
$tables_result = $conn->query("SHOW TABLES");
$count = 0;
echo "<table border='1' cellpadding='5' cellspacing='0'>";
echo "<tr><th>#</th><th>테이블명</th><th>행 수</th></tr>";
while ($row = $tables_result->fetch(PDO::FETCH_NUM)) {
    $count++;
    $rowCount = $conn->query("SELECT COUNT(*) FROM `{$row[0]}`")->fetchColumn();
    echo "<tr><td>$count</td><td><b>{$row[0]}</b></td><td>$rowCount</td></tr>";
}
echo "</table>";
echo "<br>총 <b>$count</b>개 테이블<br>";

echo "<hr>";
echo "<p style='color:red;font-weight:bold'>⚠️ 이 파일(init_db.php)을 실행 후 반드시 삭제하세요!</p>";
?>