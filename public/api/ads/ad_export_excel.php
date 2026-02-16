<?php
// Admin: Export ad report as real .xlsx download (transposed layout)
include_once '../db_connect.php';
session_start();

if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'] ?? '', ['admin', 'superadmin'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$ad_id = isset($_GET['ad_id']) ? intval($_GET['ad_id']) : 0;
if ($ad_id <= 0) {
    http_response_code(400);
    echo "ad_id required";
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM ads WHERE id = :id");
    $stmt->execute([':id' => $ad_id]);
    $ad = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$ad) {
        http_response_code(404);
        echo "Ad not found";
        exit();
    }

    $daily = [];
    try {
        $stmt2 = $conn->prepare("SELECT stat_date, views, clicks FROM ad_daily_stats WHERE ad_id = :id ORDER BY stat_date ASC");
        $stmt2->execute([':id' => $ad_id]);
        $daily = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $ignore) {
        $daily = [];
    }

    $ctr = intval($ad['view_count']) > 0 ? round((intval($ad['click_count']) / intval($ad['view_count'])) * 100, 2) : 0;

    // Build xlsx using ZipArchive + XML
    $tmpFile = tempnam(sys_get_temp_dir(), 'xlsx_');

    $zip = new ZipArchive();
    if ($zip->open($tmpFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        throw new Exception('Cannot create zip');
    }

    // [Content_Types].xml
    $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>');

    // _rels/.rels
    $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>');

    // xl/_rels/workbook.xml.rels
    $zip->addFromString('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>');

    // xl/workbook.xml
    $zip->addFromString('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="광고 리포트" sheetId="1" r:id="rId1"/></sheets>
</workbook>');

    // xl/styles.xml (header bold + number format)
    $zip->addFromString('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="맑은 고딕"/></font>
    <font><b/><sz val="11"/><name val="맑은 고딕"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF4F46E5"/></patternFill></fill>
  </fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
</styleSheet>');

    // Build shared strings and sheet data
    $strings = [];
    $stringIndex = [];

    function addString($str, &$strings, &$stringIndex)
    {
        $str = (string) $str;
        if (!isset($stringIndex[$str])) {
            $stringIndex[$str] = count($strings);
            $strings[] = $str;
        }
        return $stringIndex[$str];
    }

    function colLetter($col)
    {
        $letter = '';
        while ($col >= 0) {
            $letter = chr(65 + ($col % 26)) . $letter;
            $col = intval($col / 26) - 1;
        }
        return $letter;
    }

    // Build rows
    $rows = [];
    $rowNum = 1;

    // === Summary section (transposed: metrics as columns) ===
    // Row 1: Title
    $titleIdx = addString('광고 리포트 - ' . $ad['title'], $strings, $stringIndex);
    $rows[] = '<row r="' . $rowNum . '"><c r="A' . $rowNum . '" t="s" s="1"><v>' . $titleIdx . '</v></c></row>';
    $rowNum++;

    // Row 2: empty
    $rows[] = '<row r="' . $rowNum . '"/>';
    $rowNum++;

    // Row 3: Header row (transposed): 광고ID | 제목 | 슬롯 | 시작일 | 종료일 | 총 노출수 | 총 클릭수 | CTR
    $summaryHeaders = ['광고 ID', '제목', '슬롯', '시작일', '종료일', '총 노출수', '총 클릭수', 'CTR(%)'];
    $cells = '';
    foreach ($summaryHeaders as $ci => $h) {
        $si = addString($h, $strings, $stringIndex);
        $cells .= '<c r="' . colLetter($ci) . $rowNum . '" t="s" s="1"><v>' . $si . '</v></c>';
    }
    $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
    $rowNum++;

    // Row 4: Values
    $summaryValues = [
        $ad['id'],
        $ad['title'],
        $ad['slot_id'],
        $ad['start_date'] ?: '-',
        $ad['end_date'] ?: '-',
        intval($ad['view_count']),
        intval($ad['click_count']),
        $ctr . '%'
    ];
    $cells = '';
    foreach ($summaryValues as $ci => $v) {
        if (is_numeric($v) && strpos((string) $v, '%') === false) {
            $cells .= '<c r="' . colLetter($ci) . $rowNum . '"><v>' . $v . '</v></c>';
        } else {
            $si = addString($v, $strings, $stringIndex);
            $cells .= '<c r="' . colLetter($ci) . $rowNum . '" t="s"><v>' . $si . '</v></c>';
        }
    }
    $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
    $rowNum++;

    // Row 5-6: empty
    $rows[] = '<row r="' . $rowNum . '"/>';
    $rowNum++;
    $rows[] = '<row r="' . $rowNum . '"/>';
    $rowNum++;

    // === Daily stats section (transposed: dates as columns, metrics as rows) ===
    if (count($daily) > 0) {
        $dailyTitleIdx = addString('일별 상세 데이터', $strings, $stringIndex);
        $rows[] = '<row r="' . $rowNum . '"><c r="A' . $rowNum . '" t="s" s="1"><v>' . $dailyTitleIdx . '</v></c></row>';
        $rowNum++;

        // Transposed layout:
        // Row: header col (항목) | date1 | date2 | date3 ...
        // Row: 노출수           | 100   | 200   | 150   ...
        // Row: 클릭수           | 5     | 10    | 8     ...
        // Row: CTR(%)           | 5.0%  | 5.0%  | 5.3%  ...

        $metricLabels = ['날짜', '노출수', '클릭수', 'CTR(%)'];

        // Header row: "항목" + all dates
        $cells = '';
        $headerIdx = addString('항목', $strings, $stringIndex);
        $cells .= '<c r="A' . $rowNum . '" t="s" s="1"><v>' . $headerIdx . '</v></c>';
        foreach ($daily as $di => $d) {
            $dateStr = $d['stat_date'];
            $si = addString($dateStr, $strings, $stringIndex);
            $cells .= '<c r="' . colLetter($di + 1) . $rowNum . '" t="s" s="1"><v>' . $si . '</v></c>';
        }
        $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
        $rowNum++;

        // Views row
        $cells = '';
        $si = addString('노출수', $strings, $stringIndex);
        $cells .= '<c r="A' . $rowNum . '" t="s" s="1"><v>' . $si . '</v></c>';
        foreach ($daily as $di => $d) {
            $cells .= '<c r="' . colLetter($di + 1) . $rowNum . '"><v>' . intval($d['views']) . '</v></c>';
        }
        $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
        $rowNum++;

        // Clicks row
        $cells = '';
        $si = addString('클릭수', $strings, $stringIndex);
        $cells .= '<c r="A' . $rowNum . '" t="s" s="1"><v>' . $si . '</v></c>';
        foreach ($daily as $di => $d) {
            $cells .= '<c r="' . colLetter($di + 1) . $rowNum . '"><v>' . intval($d['clicks']) . '</v></c>';
        }
        $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
        $rowNum++;

        // CTR row
        $cells = '';
        $si = addString('CTR(%)', $strings, $stringIndex);
        $cells .= '<c r="A' . $rowNum . '" t="s" s="1"><v>' . $si . '</v></c>';
        foreach ($daily as $di => $d) {
            $day_ctr = intval($d['views']) > 0 ? round((intval($d['clicks']) / intval($d['views'])) * 100, 2) : 0;
            $ctrStr = $day_ctr . '%';
            $si2 = addString($ctrStr, $strings, $stringIndex);
            $cells .= '<c r="' . colLetter($di + 1) . $rowNum . '" t="s"><v>' . $si2 . '</v></c>';
        }
        $rows[] = '<row r="' . $rowNum . '">' . $cells . '</row>';
    } else {
        $noDataIdx = addString('일별 상세 데이터 없음 (아직 집계되지 않음)', $strings, $stringIndex);
        $rows[] = '<row r="' . $rowNum . '"><c r="A' . $rowNum . '" t="s"><v>' . $noDataIdx . '</v></c></row>';
    }

    // Build sharedStrings.xml
    $ssXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
    $ssXml .= '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' . count($strings) . '" uniqueCount="' . count($strings) . '">';
    foreach ($strings as $s) {
        $ssXml .= '<si><t>' . htmlspecialchars($s, ENT_XML1, 'UTF-8') . '</t></si>';
    }
    $ssXml .= '</sst>';
    $zip->addFromString('xl/sharedStrings.xml', $ssXml);

    // Build sheet1.xml
    $sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
    $sheetXml .= '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    $sheetXml .= '<cols><col min="1" max="1" width="16" bestFit="1"/></cols>';
    $sheetXml .= '<sheetData>' . implode("\n", $rows) . '</sheetData>';
    $sheetXml .= '</worksheet>';
    $zip->addFromString('xl/worksheets/sheet1.xml', $sheetXml);

    $zip->close();

    // Send file
    $filename = 'ad_report_' . $ad_id . '_' . date('Ymd') . '.xlsx';
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . filesize($tmpFile));
    header('Cache-Control: max-age=0');
    readfile($tmpFile);
    unlink($tmpFile);

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
?>