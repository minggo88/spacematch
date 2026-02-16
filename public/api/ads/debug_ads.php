<?php
// ─── Ad System Diagnostic Tool ───
// 사용 후 반드시 삭제하세요!
include_once '../db_connect.php';
session_start();

header('Content-Type: text/html; charset=utf-8');
echo "<html><head><meta charset='UTF-8'><title>Ad Debug</title>";
echo "<style>body{font-family:sans-serif;padding:20px;max-width:1000px;margin:0 auto}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{padding:8px 12px;border:1px solid #ddd;text-align:left;font-size:13px}th{background:#f5f5f5}.active{color:green;font-weight:bold}.inactive{color:red}.expired{color:orange}h2{margin-top:30px}img{max-width:200px;max-height:60px}</style>";
echo "</head><body>";

$today = date('Y-m-d');
echo "<h1>🔍 SpaceMatch 광고 디버그</h1>";
echo "<p>현재 서버 날짜: <b>{$today}</b></p>";

// 1. 전체 광고 목록
echo "<h2>📋 전체 광고 목록 (DB)</h2>";
try {
    $stmt = $conn->query("SELECT * FROM ads ORDER BY slot_id, priority DESC");
    $allAds = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($allAds)) {
        echo "<p style='color:red'>⚠️ 광고 테이블에 데이터가 없습니다!</p>";
    } else {
        echo "<p>총 <b>" . count($allAds) . "</b>개 광고</p>";
        echo "<table><tr><th>ID</th><th>Slot</th><th>제목</th><th>활성</th><th>시작일</th><th>종료일</th><th>날짜상태</th><th>Priority</th><th>노출수</th><th>클릭수</th><th>이미지</th></tr>";
        foreach ($allAds as $ad) {
            $activeClass = $ad['is_active'] == 1 ? 'active' : 'inactive';
            $activeText = $ad['is_active'] == 1 ? '✅ 활성' : '❌ 비활성';

            // Check date validity
            $dateStatus = '✅ 유효';
            $dateClass = 'active';
            if ($ad['start_date'] && $ad['start_date'] > $today) {
                $dateStatus = '⏳ 아직 시작 안됨';
                $dateClass = 'expired';
            }
            if ($ad['end_date'] && $ad['end_date'] < $today) {
                $dateStatus = '⛔ 만료됨';
                $dateClass = 'inactive';
            }

            $imgTag = $ad['image_url'] ? "<img src='{$ad['image_url']}' onerror=\"this.outerHTML='❌ 이미지 로드 실패: {$ad['image_url']}'\">" : '없음';

            echo "<tr>";
            echo "<td>{$ad['id']}</td>";
            echo "<td><b>{$ad['slot_id']}</b></td>";
            echo "<td>{$ad['title']}</td>";
            echo "<td class='{$activeClass}'>{$activeText}</td>";
            echo "<td>" . ($ad['start_date'] ?? '없음') . "</td>";
            echo "<td>" . ($ad['end_date'] ?? '없음') . "</td>";
            echo "<td class='{$dateClass}'>{$dateStatus}</td>";
            echo "<td>{$ad['priority']}</td>";
            echo "<td>" . ($ad['view_count'] ?? 0) . "</td>";
            echo "<td>" . ($ad['click_count'] ?? 0) . "</td>";
            echo "<td>{$imgTag}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
} catch (PDOException $e) {
    echo "<p style='color:red'>❌ DB 에러: " . $e->getMessage() . "</p>";
}

// 2. 슬롯별 실제 표시될 광고 시뮬레이션
echo "<h2>🖥️ 슬롯별 실제 표시될 광고 (get_ads.php 시뮬레이션)</h2>";
$slots = [
    'home_a',
    'home_b',
    'home_c',
    'home_d',
    'home_e',
    'home_f',
    'directory_c',
    'directory_d',
    'seller_community_top',
    'seller_community_feed',
    'vendor_community_top',
    'vendor_community_feed',
    'general_community_top',
    'general_community_feed'
];

echo "<table><tr><th>슬롯 ID</th><th>표시될 광고</th><th>이유</th></tr>";
foreach ($slots as $slot) {
    try {
        $stmt = $conn->prepare("
            SELECT id, title, image_url, is_active, start_date, end_date, priority
            FROM ads
            WHERE slot_id = :slot_id
              AND is_active = 1
              AND (start_date IS NULL OR start_date <= :today1)
              AND (end_date IS NULL OR end_date >= :today2)
            ORDER BY priority DESC, RAND()
            LIMIT 1
        ");
        $stmt->execute([':slot_id' => $slot, ':today1' => $today, ':today2' => $today]);
        $ad = $stmt->fetch(PDO::FETCH_ASSOC);

        // Also check if there ARE ads for this slot but filtered out
        $allForSlot = $conn->prepare("SELECT id, title, is_active, start_date, end_date FROM ads WHERE slot_id = :slot_id");
        $allForSlot->execute([':slot_id' => $slot]);
        $allSlotAds = $allForSlot->fetchAll(PDO::FETCH_ASSOC);

        if ($ad) {
            echo "<tr><td><b>{$slot}</b></td><td class='active'>✅ #{$ad['id']} \"{$ad['title']}\" (priority: {$ad['priority']})</td><td>정상 표시</td></tr>";
        } else if (!empty($allSlotAds)) {
            $reasons = [];
            foreach ($allSlotAds as $sa) {
                $r = "#{$sa['id']} \"{$sa['title']}\" → ";
                if ($sa['is_active'] != 1)
                    $r .= "비활성화됨; ";
                if ($sa['end_date'] && $sa['end_date'] < $today)
                    $r .= "만료됨({$sa['end_date']}); ";
                if ($sa['start_date'] && $sa['start_date'] > $today)
                    $r .= "시작 전({$sa['start_date']}); ";
                $reasons[] = $r;
            }
            echo "<tr><td><b>{$slot}</b></td><td class='inactive'>❌ 표시 안됨</td><td class='expired'>광고 " . count($allSlotAds) . "개 있지만 필터링됨:<br>" . implode('<br>', $reasons) . "</td></tr>";
        } else {
            echo "<tr><td><b>{$slot}</b></td><td style='color:gray'>— 등록된 광고 없음</td><td>-</td></tr>";
        }
    } catch (PDOException $e) {
        echo "<tr><td>{$slot}</td><td class='inactive'>❌ 에러</td><td>" . $e->getMessage() . "</td></tr>";
    }
}
echo "</table>";

// 3. 이미지 경로 확인
echo "<h2>🖼️ 이미지 파일 존재 확인</h2>";
$doc_root = $_SERVER['DOCUMENT_ROOT'];
$app_base = '';
if (preg_match('#(/[^/]+)(/api/|/uploads/)#', $_SERVER['SCRIPT_NAME'], $m)) {
    $app_base = $m[1];
}
echo "<p>DOCUMENT_ROOT: <code>{$doc_root}</code></p>";
echo "<p>App Base Path: <code>{$app_base}</code></p>";

$upload_dir = $doc_root . $app_base . '/uploads/ads/';
echo "<p>Upload Dir: <code>{$upload_dir}</code></p>";
echo "<p>Dir Exists: " . (is_dir($upload_dir) ? '✅ Yes' : '❌ No') . "</p>";

if (is_dir($upload_dir)) {
    $files = glob($upload_dir . '*');
    echo "<p>파일 수: <b>" . count($files) . "</b></p>";
    if (count($files) > 0) {
        echo "<ul>";
        foreach (array_slice($files, 0, 20) as $f) {
            echo "<li>" . basename($f) . " (" . round(filesize($f) / 1024) . "KB)</li>";
        }
        if (count($files) > 20)
            echo "<li>... 외 " . (count($files) - 20) . "개</li>";
        echo "</ul>";
    }
}

echo "<hr><p style='color:red;font-weight:bold'>⚠️ 확인 완료 후 이 파일(debug_ads.php)을 반드시 삭제하세요!</p>";
echo "</body></html>";
?>