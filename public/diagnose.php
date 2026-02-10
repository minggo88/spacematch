<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/html; charset=utf-8');

echo "<h2>🔍 SpaceMatch 사용자 API 진단 도구</h2>";

// 1. DB Connection Test
echo "<h3>1. 데이터베이스 연결</h3>";
if (file_exists('api/db_connect.php')) {
    include_once 'api/db_connect.php';
    echo "✅ DB 연결 성공<br>";
} else {
    die("❌ db_connect.php 파일을 찾을 수 없습니다.");
}

// 2. Session Check
echo "<h3>2. 세션 상태</h3>";
session_start();
echo "세션 ID: " . session_id() . "<br>";
echo "user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : '<없음>') . "<br>";
echo "user_role: " . (isset($_SESSION['user_role']) ? $_SESSION['user_role'] : '<없음>') . "<br>";

if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'superadmin'])) {
    echo "<span style='color:red;'>⚠️ 현재 로그인된 사용자가 관리자 권한이 아니거나 세션이 끊어졌습니다.<br>";
    echo "→ <strong>해결책: 먼저 관리자 계정으로 로그인 한 뒤, 이 페이지를 다시 새로고침하세요.</strong></span><br>";
}

// 3. Table Check
echo "<h3>3. 테이블 존재 여부</h3>";
$tables = ['users', 'venues', 'applications', 'banned_users'];
foreach ($tables as $t) {
    try {
        $conn->query("SELECT 1 FROM $t LIMIT 1");
        echo "✅ '$t' 테이블 존재<br>";
    } catch (PDOException $e) {
        echo "❌ '$t' 테이블 없음 또는 오류: " . $e->getMessage() . "<br>";
    }
}

// 4. Users Query Test
echo "<h3>4. 사용자 목록 조회 테스트</h3>";
try {
    $query = "SELECT 
                u.id, u.name, u.business_no, u.email, u.phone, u.role, u.status, u.venue_limit, u.created_at,
                (SELECT COUNT(*) FROM venues v WHERE v.owner_id = u.id) as venue_count,
                (SELECT COUNT(*) FROM applications a WHERE a.user_id = u.id) as app_count
              FROM users u 
              WHERE u.role != 'superadmin' 
              ORDER BY u.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "✅ 쿼리 성공! 총 <strong>" . count($users) . "</strong>명의 사용자 조회됨.<br>";

    if (count($users) > 0) {
        echo "<table border='1' cellpadding='5' style='border-collapse:collapse; margin-top:10px;'>";
        echo "<tr style='background:#eee;'><th>ID</th><th>이름</th><th>이메일</th><th>역할</th><th>상태</th></tr>";
        foreach ($users as $u) {
            echo "<tr>";
            echo "<td>{$u['id']}</td>";
            echo "<td>{$u['name']}</td>";
            echo "<td>{$u['email']}</td>";
            echo "<td>{$u['role']}</td>";
            echo "<td>{$u['status']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<span style='color:orange;'>ℹ️ 데이터베이스에 superadmin 외 사용자가 없습니다.</span>";
    }

} catch (PDOException $e) {
    echo "❌ SQL 오류: " . $e->getMessage() . "<br>";
}

echo "<hr><p style='color:gray;'>진단 완료. 이 파일(diagnose.php)은 확인 후 삭제해주세요.</p>";
?>