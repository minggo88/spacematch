const fs = require('fs');
const filePath = 'c:/Users/KYUNG005/Desktop/spacematch/src/pages/seller/SellerDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix REGION_SHORT - replace lines 180-185
const oldBlock = content.match(/const REGION_SHORT = \{[\s\S]*?'강원': '강원'\s*\};/);
if (oldBlock) {
    content = content.replace(oldBlock[0], `const REGION_SHORT = {
        '서울': '서울', '경기': '경기', '인천광역시': '인천',
        '대전광역시': '대전', '대구광역시': '대구', '광주광역시': '광주',
        '부산광역시': '부산', '울산광역시': '울산', '제주특별자치': '제주',
        '강원': '강원'
    };`);
    console.log('✅ Fixed REGION_SHORT');
} else {
    console.log('❌ REGION_SHORT not found');
}

// Also fix line 175: '급상??공간 로드 ?패:'
content = content.replace(/급상.{2}공간 로드 .{2}패:/, '급상승 공간 로드 실패:');

// Replace ALL remaining \uFFFD in SellerDashboard
const lines = content.split(/\r?\n/);
const le = content.includes('\r\n') ? '\r\n' : '\n';
let fixCount = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('\uFFFD')) {
        fixCount++;
        console.log(`  Line ${i + 1} still corrupted: ${lines[i].trim().substring(0, 80)}`);
    }
}
console.log(`${fixCount} corrupted lines remaining in SellerDashboard.jsx`);

fs.writeFileSync(filePath, content, 'utf8');
