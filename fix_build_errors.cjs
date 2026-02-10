/**
 * Fix build-breaking syntax errors in corrupted JSX files.
 * Targets specific patterns that cause esbuild to fail.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Files that have build errors
const targetFiles = [
    'pages/admin/AdminAds.jsx',
    'pages/vendor/VendorApplications.jsx',
    'pages/vendor/VendorVenues.jsx',
    'pages/seller/SellerProfile.jsx',
    'pages/RecruitmentDashboard.jsx',
    'pages/seller/SellerApplications.jsx',
    'pages/admin/AdminVenues.jsx',
];

let totalFixes = 0;

targetFiles.forEach(relPath => {
    const filePath = path.join(srcDir, relPath);
    if (!fs.existsSync(filePath)) {
        console.log(`SKIP: ${relPath} not found`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let fixes = 0;

    // Pattern 1: Fix '\u2019\uFFFD' (right single quote + replacement char) inside strings
    // These appear as garbled text like 'Services'​How It Works'
    // The \u2019\uFFFD pattern breaks JS parsing
    const p1 = /\u2019\uFFFD/g;
    const p1count = (content.match(p1) || []).length;
    if (p1count > 0) {
        content = content.replace(p1, ' ');
        fixes += p1count;
        console.log(`  [${relPath}] Fixed ${p1count} right-quote+replacement-char patterns`);
    }

    // Pattern 2: Fix lone replacement character \uFFFD that breaks strings
    // Only fix when inside a string literal context (between quotes)
    const p2 = /\uFFFD/g;
    const p2count = (content.match(p2) || []).length;
    if (p2count > 0) {
        content = content.replace(p2, '');
        fixes += p2count;
        console.log(`  [${relPath}] Removed ${p2count} replacement characters`);
    }

    // Pattern 3: Fix broken JSX fragment closing tags like: 활성화</>}  -->  활성화</> : ...}
    // Specifically: ?성화</>}  where the previous ternary branch used :<> but fragment is closed wrongly
    // Pattern: <>..활</>  (missing closing fragment, has />)
    // Look for patterns like:  활?성화</>  where </> should be </>
    // Actually the issue is: /\u003e} instead of the proper closing

    // Pattern 4: Fix stray quotes inside Korean strings
    // e.g., '?정/??' '한?니??' -> '?정/?? 한?니??'
    // Look for: closing-quote space opening-quote pattern inside what should be a single string
    // This is the "mid-string apostrophe" pattern

    // Pattern 5: Fix '?? /?>' (broken JSX fragment with stray characters before closing)
    // e.g.: 활성화</>} should become 활성화</>}
    // but we see: ?성??/> which is broken

    // Pattern 6: Fix double-quote inside single-quoted attribute values
    // e.g., placeholder="???"????" which breaks when " appears mid-value
    // We need to escape or replace these

    // Pattern 7: Fix '${venue".' patterns - broken template literals
    // e.g., `"${venue".name || ''}"`  -> `"${venue?.name || ''}"`
    const p7 = /\$\{venue"\./g;
    const p7count = (content.match(p7) || []).length;
    if (p7count > 0) {
        content = content.replace(p7, '${venue?.');
        fixes += p7count;
        console.log(`  [${relPath}] Fixed ${p7count} broken template literal patterns`);
    }

    // Pattern 8: Fix lines with stray '' at the beginning of a string continuation
    // e.g., showToast('' 에러' 발생?습?다.', 'error')  -> showToast('에러 발생했습니다.', 'error')
    // Actually fix: '' followed by space and Korean text in what should be single string
    const p8 = /'\s*'\s*(\uC5D0|\uC758|\uC5D0\uB7EC)/g;
    const p8count = (content.match(p8) || []).length;
    if (p8count > 0) {
        content = content.replace(p8, "'$1");
        fixes += p8count;
        console.log(`  [${relPath}] Fixed ${p8count} stray empty-string patterns`);
    }

    if (fixes > 0 && content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  SAVED ${relPath} with ${fixes} fixes`);
        totalFixes += fixes;
    } else {
        console.log(`  [${relPath}] No changes needed`);
    }
});

console.log(`\nTotal fixes applied: ${totalFixes}`);
