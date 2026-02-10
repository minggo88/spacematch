const fs = require('fs');

// ============= Fix VenueDetailModal.jsx =============
{
    const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/components/VenueDetailModal.jsx';
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    // Fix lines 261-279: the scrambled commission/detail section
    // Line 261: should just be "수수료" label span
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();

        // Fix "typeLabels" span that's inside commission section (should not be here)
        if (t.includes('typeLabels[venue.type]') && t.includes('text-sm font-semibold text-gray-900')) {
            lines[i] = '                                        수수료';
            n++;
            console.log(`Fixed line ${i + 1}: removed misplaced typeLabels span, replaced with "수수료" text`);
        }

        // Fix MapPin span that's inside commission section
        if (t.includes('MapPin') && t.includes('text-gray-400') && t.includes('위치')) {
            lines[i] = '                                        ' + (c.includes('\uFFFD') ? '' : '') + '{commissionRate > 0 ? `${commissionRate}%` : \'없음\'}';
            n++;
            console.log(`Fixed line ${i + 1}: removed misplaced MapPin, replaced with commission value`);
        }

        // Fix "매출이기 ..." corrupted text
        if (t.includes('매출') && t.includes('\uFFFD') && t.includes('수료')) {
            lines[i] = '                                    <p className="text-xs text-orange-500 mt-1">매출 기반 수수료가 적용됩니다</p>';
            n++;
            console.log(`Fixed line ${i + 1}: fixed commission description`);
        }

        // Fix "가격 단위" span that replaced "공간 상세 정보"  
        if (t.includes('text-sm text-gray-500') && t.includes('가격 단위') && lines[i - 1]?.trim().includes('Tag size')) {
            lines[i] = '                                공간 상세 정보';
            n++;
            console.log(`Fixed line ${i + 1}: restored "공간 상세 정보" heading`);
        }

        // Fix "신청 완료" text
        if (t.includes('신청') && t.includes('\uFFFD') && t.includes('료')) {
            lines[i] = lines[i].replace(/\uFFFD/g, '').replace(/신청.*료/, '신청 완료');
            if (lines[i].includes('신청 완료')) { n++; console.log(`Fixed line ${i + 1}: 신청 완료`); }
        }

        // Fix "입점 신청하기" button text
        if (t.includes('점 ') && t.includes('청') && t.includes('기') && t.includes('<span>')) {
            lines[i] = '                                    <span>입점 신청하기</span>';
            n++;
            console.log(`Fixed line ${i + 1}: 입점 신청하기`);
        }
    }

    c = lines.join(le);
    fs.writeFileSync(fp, c, 'utf8');
    console.log(`VenueDetailModal: ${n} fixes`);
}

// ============= Fix SellerDashboard.jsx remaining =============
{
    const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/pages/seller/SellerDashboard.jsx';
    let c = fs.readFileSync(fp, 'utf8');
    const le = c.includes('\r\n') ? '\r\n' : '\n';
    const lines = c.split(/\r?\n/);
    let n = 0;

    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();

        // console.error lines with \uFFFD
        if (t.includes('console.error') && t.includes('\uFFFD') && t.includes('레')) {
            if (t.includes('JSON')) {
                lines[i] = lines[i].replace(/레[\uFFFD\?]*스 JSON [\uFFFD\?]*싱 [\uFFFD\?]*패/, '레퍼런스 JSON 파싱 실패');
                n++; console.log(`Fixed line ${i + 1}: JSON parse error msg`);
            } else if (t.includes('로드')) {
                lines[i] = lines[i].replace(/레[\uFFFD\?]*스 로드 [\uFFFD\?]*패/, '레퍼런스 로드 실패');
                n++; console.log(`Fixed line ${i + 1}: load error msg`);
            }
        }
        if (t.includes('console.log') && t.includes('\uFFFD') && t.includes('레')) {
            if (t.includes('API')) {
                lines[i] = lines[i].replace(/레[\uFFFD\?]*스 API [\uFFFD\?]*답/, '레퍼런스 API 응답');
                n++; console.log(`Fixed line ${i + 1}: API response msg`);
            } else if (t.includes('이터')) {
                lines[i] = lines[i].replace(/레[\uFFFD\?]*스 [\uFFFD\?]*이터[\uFFFD\?]*/, '레퍼런스 데이터');
                n++; console.log(`Fixed line ${i + 1}: data msg`);
            }
        }

        // "인기 레퍼런스" comment
        if (t.includes('// Combine') && t.includes('\uFFFD')) {
            lines[i] = lines[i].replace(/\/\/.*$/, '// Combine hot_top and hot_mid as "인기 레퍼런스"');
            n++; console.log(`Fixed line ${i + 1}: comment`);
        }

        // "수수료" text in venue card
        if (t.includes('수수') && t.includes('\uFFFD') && t.includes('{ven')) {
            lines[i] = lines[i].replace(/\uFFFD*수\uFFFD*{ven/, '수수료 {ven').replace(/\uFFFD/g, '');
            n++; console.log(`Fixed line ${i + 1}: commission text`);
        }
    }

    c = lines.join(le);

    // Now do simple string replacements for remaining \uFFFD patterns
    const remaining = [
        ['인기 레\uFFFD런스', '인기 레퍼런스'],
        ['급상\uFFFD\uFFFD공간', '급상승 공간'],
        ['지\uFFFD로 보기', '지도로 보기'],
    ];
    for (const [f, r] of remaining) {
        if (c.includes(f)) { c = c.replaceAll(f, r); n++; }
    }

    fs.writeFileSync(fp, c, 'utf8');
    console.log(`SellerDashboard: ${n} fixes`);
}

// Count remaining
function countRemaining(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let count = 0;
    for (const e of entries) {
        const full = require('path').join(dir, e.name);
        if (e.isDirectory()) count += countRemaining(full);
        else if (e.name.endsWith('.jsx') || e.name.endsWith('.js')) {
            const content = fs.readFileSync(full, 'utf8');
            const lines = content.split('\n');
            let fc = 0;
            for (const l of lines) { if (l.includes('\uFFFD')) fc++; }
            if (fc > 0) {
                console.log(`  ${require('path').relative('c:/Users/KYUNG005/Desktop/spacematch/src', full)}: ${fc} lines`);
                count += fc;
            }
        }
    }
    return count;
}
console.log(`\nRemaining corrupted lines:`);
const total = countRemaining('c:/Users/KYUNG005/Desktop/spacematch/src');
console.log(`Total: ${total}`);
