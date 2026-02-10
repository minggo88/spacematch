const fs = require('fs');
const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/pages/LandingPage.jsx';
let c = fs.readFileSync(fp, 'utf8');
const le = c.includes('\r\n') ? '\r\n' : '\n';
const lines = c.split(/\r?\n/);

// Fix lines 394-408 (the corrupted step data block)
for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();

    // Line with handleSignup button inside step data (line 395)
    if (t.includes('handleSignup') && t.includes('가입하기')) {
        lines[i] = "                                title: '회원가입',";
        console.log(`Fixed line ${i + 1}: step 01 title`);
    }
    // Line with signupError inside step data (line 396)
    if (t.includes('signupError') && t.includes('text-red-500')) {
        lines[i] = "                                desc: '간단한 정보 입력으로 셀러 또는 벤더로 가입하세요. SNS 계정 연동으로 더욱 빠르게 시작할 수 있습니다.',";
        console.log(`Fixed line ${i + 1}: step 01 desc`);
    }
    // Step 02 title corruption
    if (t.includes("'공간 / 브랜") && t.includes('\uFFFD')) {
        lines[i] = "                                title: '공간 / 브랜드 탐색',";
        console.log(`Fixed line ${i + 1}: step 02 title`);
    }
    // Step 03 title corruption
    if (t.includes("'매칭") && t.includes('\uFFFD') && t.includes('점')) {
        lines[i] = "                                title: '매칭 & 입점',";
        console.log(`Fixed line ${i + 1}: step 03 title`);
    }
    // Step 03 desc corruption
    if (t.includes("점 ?") && t.includes("청 ?") && t.includes("공간") && t.includes("공?")) {
        lines[i] = "                                desc: '입점 신청 후 공간 제공자의 승인이 완료되면 바로 사업 운영을 시작할 수 있습니다.',";
        console.log(`Fixed line ${i + 1}: step 03 desc`);
    }

    // Fix other remaining corrupted lines
    // Process section text
    if (t.includes('복잡') && t.includes('\uFFFD') && t.includes('3')) {
        lines[i] = "                            복잡한 절차 없이, 간단한 3단계로";
        console.log(`Fixed line ${i + 1}: process text`);
    }
    if (t.includes('매칭') && t.includes('\uFFFD') && t.includes('작') && !t.includes('step')) {
        lines[i] = "                            매칭을 시작할 수 있습니다";
        console.log(`Fixed line ${i + 1}: process text 2`);
    }

    // "이용 방법" link
    if (t.includes('용 방법') && t.includes('\uFFFD') && t.includes('보기')) {
        lines[i] = lines[i].replace(/\uFFFD+[^\uFFFD]*\uFFFD*용 방법 \uFFFD+세\uFFFD+보기/, '이용 방법 자세히 보기');
        console.log(`Fixed line ${i + 1}: usage link`);
    }
}

c = lines.join(le);
fs.writeFileSync(fp, c, 'utf8');

// Count remaining
const remainLines = c.split(/\r?\n/).filter(l => l.includes('\uFFFD')).length;
console.log(`\nRemaining corrupted lines in LandingPage: ${remainLines}`);
