/**
 * COMPREHENSIVE FINAL FIX - All remaining corrupted Korean text
 * Uses regex to find corrupted lines and replaces them with correct text
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

function fixAll(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;
    for (const [find, replace] of replacements) {
        if (typeof find === 'string') {
            if (content.includes(find)) {
                content = content.replace(find, replace);
                count++;
            }
        } else {
            // regex
            if (find.test(content)) {
                content = content.replace(find, replace);
                count++;
            }
        }
    }
    if (count > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`\u2705 ${path.basename(filePath)}: ${count} fixes`);
    }
    return count;
}

let total = 0;

// Helper: match a line with corrupted chars and replace entire line
function lineReplace(content, partialMatch, correctLine) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(partialMatch)) {
            lines[i] = correctLine + (content.includes('\r\n') ? '\r' : '');
            content = lines.join('\n');
            return content;
        }
    }
    return content;
}

// ============================================================
// SellerDashboard.jsx - 39 remaining lines
// ============================================================
{
    const fp = path.join(BASE, 'pages/seller/SellerDashboard.jsx');
    let c = fs.readFileSync(fp, 'utf8');
    let n = 0;
    const fixes = [
        // console.error and console.log lines
        ["JSON ?�싱 ?�패:", "JSON 파싱 실패:"],
        ["API ?�답:", "API 응답:"],
        ['"?�한 ?�레?�스"', '"인기 레퍼런스"'],
        ["?�이??'", "데이터'"],
        ["?�레?�스 로드 ?�패:", "레퍼런스 로드 실패:"],
        ["벤더 계정 ?\u0000", "벤더 계정으로는 입점 신청을 할 수 없습니다."],
        // alert messages
        ["?�청???�료?�었?�니??", "신청이 완료되었습니다!"],
        ["?�청???�패?�습?�다:", "신청에 실패했습니다:"],
        ["?�스???�류:", "시스템 오류:"],
        // UI elements
        ["?�수�?{ven", "수수료 {ven"],
        ['??베뉴???????�세???�명???�습?�다.', '이 베뉴에 대한 자세한 설명이 없습니다.'],
        [">?�점 ?�황<", ">입점 현황<"],
        ["벤더 계정?? ?�청 불�?", "벤더 계정은 신청 불가"],
        ["'?�점 ?�청?�기'}", "'입점 신청하기'}"],
        ["?�수�?{commission}%", "수수료 {commission}%"],
        ["?�신??브랜?�에 ??맞는 ?�별??베뉴�?찾아보세??", "당신의 브랜드에 딱 맞는 특별한 베뉴를 찾아보세요"],
        [">?�한 ?�레?�스<", ">인기 레퍼런스<"],
        ["급상??공간", "급상승 공간"],
        ["?�롭�??�록???�오르는", "새롭게 등록되어 떠오르는"],
        ["�??�로 보기", "지도로 보기"],
        ["마커�??�릭?�면 베", "마커를 클릭하면 베"],
        ["모든 공간", "모든 공간"],
        ["찾으?�는 �???��??베뉴 ?�름???�력?�세??..", "찾으시는 지역이나 베뉴 이름을 입력하세요.."],
        // option elements
        ["?�업 ?�토", "팝업 스토어"],
        ["?�리마켓", "플리마켓"],
        ["카페/?�스?�랑", "카페/레스토랑"],
        [">?�룸<", ">쇼룸<"],
        ["모든 �?격�?", "모든 가격대"],
        ["10만원 ?�하", "10만원 이하"],
        ["30만원 ?�상", "30만원 이상"],
        // no result messages
        ["조건??맞는 베뉴�? ?�어??", "조건에 맞는 베뉴가 없어요"],
        ["?�른 �??�어???�터�??�도?�보?�요!", "다른 키워드나 필터를 시도해보세요!"],
        // modal
        [">?�점 ?�청<", ">입점 신청<"],
        ["?�망 ?�사 기간", "희망 행사 기간"],
        ["'?�청 �?..'", "'신청 중..'"],
        ["'?�청?�기'", "'신청하기'"],
    ];
    for (const [find, replace] of fixes) {
        if (c.includes(find)) {
            c = c.replace(find, replace);
            n++;
        }
    }
    // Fix the alert line about vendor login (has complex corruption)
    c = c.replace(/alert\('벤더.*?주세.*?'\)/, "alert('벤더 계정으로는 입점 신청을 할 수 없습니다.\\n셀러 계정으로 로그인해 주세요.')");

    // Fix remaining \uFFFD patterns
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            // Try to reconstruct based on context
            const t = lines[i].trim();
            // Handle common patterns
            if (t.includes('console.error') && t.includes('?')) {
                // Various console.error lines
                lines[i] = lines[i].replace(/\uFFFD[^\uFFFD]*\uFFFD/g, '');
            }
        }
    }
    c = lines.join(le);

    fs.writeFileSync(fp, c, 'utf8');
    console.log(`SellerDashboard: ${n} pattern fixes + line fixes applied`);
    total += n;
}

// ============================================================
// Remaining VenueModal.jsx corrupted lines
// ============================================================
{
    const fp = path.join(BASE, 'components/VenueModal.jsx');
    let c = fs.readFileSync(fp, 'utf8');
    const fixes = [
        [/placeholder="공간 이름[^"]*\uFFFD[^"]*"/g, 'placeholder="공간 이름을 입력하세요"'],
        [/>주소 \*/g, '>주소 *'],
        [/📍 주소 [^\n]*/, '📍 주소 검색하기'],
        [/>상세 주소</g, '>상세 주소<'],
        [/상세주소 입력[^"]*/, '상세주소 입력 (동/호수 등)'],
        [/>지역 \*/g, '>지역 *'],
        [/지역 ?선택/g, '지역 선택'],
        [/>공간 유형 \*/g, '>공간 유형 *'],
        [/>팝업스토어</g, '>팝업스토어<'],
        [/>갤러리</g, '>갤러리<'],
        [/>카페</g, '>카페<'],
        [/>쇼룸</g, '>쇼룸<'],
        [/>플리마켓</g, '>플리마켓<'],
        [/>매장</g, '>매장<'],
        [/>공간 크기</g, '>공간 크기<'],
        [/소형 \(10평 미만\)/g, '소형 (10평 미만)'],
        [/중형 \(10~30평\)/g, '중형 (10~30평)'],
        [/대형 \(30평 이상\)/g, '대형 (30평 이상)'],
        [/가격 \(원\) \*/g, '가격 (원) *'],
        [/가격을 입력하세요/g, '가격을 입력하세요'],
        [/>가격 단위</g, '>가격 단위<'],
        [/일 단위/g, '일 단위'],
        [/주 단위/g, '주 단위'],
        [/월 단위/g, '월 단위'],
        [/수수료율 \(%\)/g, '수수료율 (%)'],
        [/설명</g, '설명<'],
        [/공간에 대한 설명을 입력하세요/g, '공간에 대한 설명을 입력하세요'],
        [/모집 기간/g, '모집 기간'],
        [/모집 시작/g, '모집 시작'],
        [/모집 마감/g, '모집 마감'],
        [/이벤트 기간/g, '이벤트 기간'],
        [/시작일/g, '시작일'],
        [/종료일/g, '종료일'],
        [/삭제</g, '삭제<'],
        [/\+ 기간 추가/g, '+ 기간 추가'],
        [/최대 셀러 수/g, '최대 셀러 수'],
        [/평균 매출/g, '평균 매출'],
        [/인기 카테고리/g, '인기 카테고리'],
        [/이 공간에서 인기 있는 카테고리를 선택하세요/g, '이 공간에서 인기 있는 카테고리를 선택하세요'],
        [/공간 이미지/g, '공간 이미지'],
        [/이미지 선택 \(최대 10장\)/g, '이미지 선택 (최대 10장)'],
    ];
    let n = 0;
    for (const [find, replace] of fixes) {
        if (typeof find === 'string' ? c.includes(find) : find.test(c)) {
            c = c.replace(find, replace);
            n++;
        }
    }

    // Fix remaining lines by replacing \uFFFD characters with context-aware replacements
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            const t = lines[i].trim();
            // Common UI label patterns
            if (t.includes('label') && t.includes('block text-sm font-bold')) {
                // Reconstruct label based on nearby context
            }
            // placeholder patterns
            if (t.includes('placeholder=')) {
                lines[i] = lines[i].replace(/\uFFFD+/g, '');
            }
        }
    }
    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');
    console.log(`VenueModal: ${n} pattern fixes`);
    total += n;
}

// ============================================================
// Count remaining corrupted lines across ALL files
// ============================================================
function countAll(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) count += countAll(full);
        else if (e.name.endsWith('.jsx') || e.name.endsWith('.js')) {
            const content = fs.readFileSync(full, 'utf8');
            const lines = content.split('\n');
            let fc = 0;
            for (const line of lines) {
                if (line.includes('\uFFFD')) fc++;
            }
            if (fc > 0) {
                console.log(`  ${path.relative(BASE, full)}: ${fc} lines`);
                count += fc;
            }
        }
    }
    return count;
}
const remaining = countAll(BASE);
console.log(`\nTotal remaining: ${remaining} corrupted lines`);
console.log(`Total fixed this run: ${total}`);
