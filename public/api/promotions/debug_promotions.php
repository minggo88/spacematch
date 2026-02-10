<?php
/**
 * debug_promotions.php
 * 프로모션 데이터 디버깅용 (임시 - 문제 해결 후 삭제)
 */
include_once '../db_connect.php';

try {
    echo "<h1>프로모션 디버깅</h1>";

    // 1. venue_promotions 테이블 전체 조회
    echo "<h2>1. venue_promotions 테이블</h2>";
    try {
        $stmt = $conn->query("SELECT * FROM venue_promotions ORDER BY id DESC");
        $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>총 " . count($promos) . "개 레코드</p>";
        echo "<pre>" . json_encode($promos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    } catch (Exception $e) {
        echo "<p style='color:red'>에러: " . $e->getMessage() . "</p>";
    }

    // 2. venues 테이블 status 확인
    echo "<h2>2. venues 테이블 status 값 분포</h2>";
    try {
        $stmt = $conn->query("SELECT status, COUNT(*) as cnt FROM venues GROUP BY status");
        $statuses = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<pre>" . json_encode($statuses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    } catch (Exception $e) {
        echo "<p style='color:red'>에러: " . $e->getMessage() . "</p>";
    }

    // 3. 프로모션 + 베뉴 JOIN 결과
    echo "<h2>3. 프로모션 JOIN 베뉴 (status 필터 없이)</h2>";
    try {
        $today = date('Y-m-d');
        $stmt = $conn->prepare("SELECT vp.*, v.name, v.status as venue_status 
                                FROM venue_promotions vp 
                                LEFT JOIN venues v ON vp.venue_id = v.id
                                WHERE vp.start_date <= ? AND vp.end_date >= ?");
        $stmt->execute([$today, $today]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>오늘 날짜: $today</p>";
        echo "<p>활성 프로모션 (날짜 기준): " . count($results) . "개</p>";
        echo "<pre>" . json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    } catch (Exception $e) {
        echo "<p style='color:red'>에러: " . $e->getMessage() . "</p>";
    }

    // 4. status='approved' 체크 JOIN
    echo "<h2>4. 프로모션 JOIN 베뉴 (status='approved' 필터 포함)</h2>";
    try {
        $today = date('Y-m-d');
        $stmt = $conn->prepare("SELECT vp.*, v.name, v.status as venue_status 
                                FROM venue_promotions vp 
                                JOIN venues v ON vp.venue_id = v.id
                                WHERE v.status = 'approved' 
                                  AND vp.start_date <= ? 
                                  AND vp.end_date >= ?");
        $stmt->execute([$today, $today]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>approved 베뉴만: " . count($results) . "개</p>";
        echo "<pre>" . json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    } catch (Exception $e) {
        echo "<p style='color:red'>에러: " . $e->getMessage() . "</p>";
    }

} catch (Exception $e) {
    echo "<p style='color:red'>전체 에러: " . $e->getMessage() . "</p>";
}
?>