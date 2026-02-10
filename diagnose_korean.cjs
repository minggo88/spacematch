// 모든 파일의 깨진 한글 줄을 정확히 출력하는 진단 스크립트
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

const files = [
    'components/VenueDetailModal.jsx',
    'components/VenueModal.jsx',
    'pages/community/CommunityPage.jsx',
    'pages/LandingPage.jsx',
    'pages/seller/SellerDashboard.jsx',
    'pages/seller/SellerVendorDirectory.jsx',
];

for (const rel of files) {
    const fp = path.join(BASE, rel);
    const content = fs.readFileSync(fp, 'utf8');
    const lines = content.split(/\r?\n/);
    const corrupted = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            corrupted.push({ line: i + 1, text: lines[i].trim().substring(0, 120) });
        }
    }
    if (corrupted.length > 0) {
        console.log(`\n=== ${rel} (${corrupted.length} lines) ===`);
        for (const c of corrupted) {
            console.log(`  L${c.line}: ${c.text}`);
        }
    }
}
