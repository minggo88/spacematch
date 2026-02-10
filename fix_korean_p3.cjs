/**
 * FINAL comprehensive Korean text restoration
 * Replaces ALL remaining corrupted lines by exact line number
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

function readFile(relPath) {
    return fs.readFileSync(path.join(BASE, relPath), 'utf8');
}

function fixFile(relPath, lineMap) {
    const filePath = path.join(BASE, relPath);
    const content = fs.readFileSync(filePath, 'utf8');
    const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
    const lines = content.split(/\r?\n/);
    let fixed = 0;

    for (const [lineNum, correctLine] of Object.entries(lineMap)) {
        const idx = parseInt(lineNum) - 1;
        if (idx >= 0 && idx < lines.length && lines[idx].includes('\uFFFD')) {
            lines[idx] = correctLine;
            fixed++;
        }
    }

    if (fixed > 0) {
        fs.writeFileSync(filePath, lines.join(lineEnding), 'utf8');
        console.log(`✅ ${relPath}: ${fixed} lines fixed`);
    }
    return fixed;
}

let total = 0;

// ============================================================
// AdminDashboard.jsx
// ============================================================
total += fixFile('pages/admin/AdminDashboard.jsx', {
    88: "                        if (data.success) { showToast('처리되었습니다.', 'success');",
    105: "                    <h1 className=\"text-3xl font-extrabold text-gray-900 tracking-tight\">대시보드</h1>",
    106: "                    <p className=\"text-gray-500 mt-2 font-medium\">플랫폼의 주요 현황을 한눈에 확인하세요</p>",
    110: "                    <p className=\"text-indigo-600 font-bold text-sm\">시스템 정상 가동</p>",
    117: "                    title=\"총 등록 베뉴\"",
    119: "                    unit=\"건\"",
    125: "                    title=\"신규 입점 신청\"",
    127: "                    unit=\"건\"",
    132: "                    title=\"승인 대기\"",
    134: "                    unit=\"건\"",
    142: "                    title=\"전체 사용자\"",
    144: "                    unit=\"명\"",
    149: "            {/* 3. Pending Approvals */}",
    151: "                <h2 className=\"text-lg font-extrabold text-gray-900\">승인 대기 공간</h2>",
    152: "                <button onClick={() => navigate('/admin/venues')} className=\"text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors\">전체보기</button>",
    155: "                    <p className=\"text-gray-400 py-8 text-center font-medium\">승인 대기중인 공간이 없습니다 🎉</p>",
    186: "                                        <span className=\"text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full\">승인 대기</span>",
    190: "                                        className=\"px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-all\"",
    191: "                                    >승인</button>",
    193: "                                        className=\"px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-all\"",
    194: "                                    >반려</button>",
    199: "            {/* 4. Quick Actions */}",
    200: "            <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">",
});

// ============================================================
// AdminCancellations.jsx
// ============================================================
total += fixFile('pages/admin/AdminCancellations.jsx', {
    46: "            confirmLabel: actionLabel,",
    58: "                    else { showToast(data.message || '처리에 실패했습니다.', 'error'); }",
    59: "                } catch { showToast('오류가 발생했습니다.', 'error'); }",
    104: "        { id: 'pending', label: '대기중', count: stats.pending, icon: <Clock size={14} />, activeColor: 'bg-amber-500 text-white', dotColor: 'bg-amber-500' },",
    105: "        { id: 'approved', label: '승인됨', count: stats.approved, icon: <CheckCircle size={14} />, activeColor: 'bg-emerald-500 text-white', dotColor: 'bg-emerald-500' },",
    106: "        { id: 'rejected', label: '거절됨', count: stats.rejected, icon: <XCircle size={14} />, activeColor: 'bg-red-500 text-white', dotColor: 'bg-red-500' },",
    107: "        { id: 'all', label: '전체', count: stats.total, icon: <FileText size={14} />, activeColor: 'bg-gray-800 text-white', dotColor: 'bg-gray-500' },",
});

// Now let's see what lines remain in AdminCancellations
{
    const content = readFile('pages/admin/AdminCancellations.jsx');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            console.log(`  AdminCancellations:${i + 1}: ${lines[i].trim().substring(0, 100)}`);
        }
    }
}

// Show remaining lines in AdminDashboard
{
    const content = readFile('pages/admin/AdminDashboard.jsx');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            console.log(`  AdminDashboard:${i + 1}: ${lines[i].trim().substring(0, 100)}`);
        }
    }
}

// Show remaining lines in VendorDashboard
{
    const content = readFile('pages/vendor/VendorDashboard.jsx');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            console.log(`  VendorDashboard:${i + 1}: ${lines[i].trim().substring(0, 100)}`);
        }
    }
}

// Show remaining lines in VendorSellerDirectory
{
    const content = readFile('pages/vendor/VendorSellerDirectory.jsx');
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            console.log(`  VendorSellerDir:${i + 1}: ${lines[i].trim().substring(0, 100)}`);
        }
    }
}

console.log(`\nPhase 3 total: ${total} fixes applied`);
