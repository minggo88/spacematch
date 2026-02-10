// Comprehensive mid-string apostrophe fixer
// Uses character code approach to avoid regex quote escaping issues

const fs = require('fs');
const path = require('path');

const SQ = String.fromCharCode(39); // single quote '

// Files to fix based on grep_search results
const filesToFix = [
    'src/pages/admin/AdminVenues.jsx',
    'src/pages/admin/AdminAds.jsx',
    'src/pages/admin/SuperAdminDatabase.jsx',
    'src/pages/vendor/VendorVenues.jsx',
    'src/pages/vendor/VendorApplications.jsx',
    'src/pages/seller/SellerProfile.jsx',
    'src/pages/seller/SellerDashboard.jsx',
    'src/pages/seller/SellerApplications.jsx',
    'src/pages/seller/SellerVendorDirectory.jsx',
    'src/pages/community/CommunityPage.jsx',
    'src/components/VenueModal.jsx',
    'src/components/VenueDetailModal.jsx',
    'src/components/NotificationPrompt.jsx',
    'src/pages/LandingPage.jsx',
    'src/pages/admin/AdminPromotions.jsx',
    'src/pages/admin/AdminCancellations.jsx',
    'src/pages/admin/AdminDashboard.jsx',
    'src/pages/RecruitmentDashboard.jsx',
    'src/context/DataContext.jsx',
    'src/components/Layout.jsx',
];

let totalFixes = 0;
const results = [];

// Korean character range regex part
const K = '\u3131-\u318E\u3200-\u321E\u3260-\u327E\uAC00-\uD7A3';

filesToFix.forEach(relPath => {
    const absPath = path.join(__dirname, relPath);
    if (!fs.existsSync(absPath)) {
        console.log(`SKIP (not found): ${relPath}`);
        return;
    }

    let content = fs.readFileSync(absPath, 'utf8');
    let fixes = 0;

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip lines with legitimate ' ' patterns
        if (line.includes('.join(' + SQ + ' ' + SQ + ')') ||
            line.includes('{' + SQ + ' ' + SQ + '}') ||
            line.includes('.split(' + SQ + ' ' + SQ + ')')) {
            continue;
        }

        let newLine = line;

        // Pattern 1: Merge adjacent single-quoted Korean strings
        // 'text1' 'text2', → 'text1 text2',
        // showToast('Korean' 'Korean', 'type')
        const p1 = new RegExp(SQ + '([^' + SQ + ']*[' + K + '?\\ufffd][^' + SQ + ']*)' + SQ + '\\s+' + SQ + '([^' + SQ + ']+)' + SQ + '(,|\\))', 'g');
        newLine = newLine.replace(p1, (match, g1, g2, g3) => {
            fixes++;
            return SQ + g1 + ' ' + g2 + SQ + g3;
        });

        // Pattern 2: Empty string + broken string
        // '' '단어' → '단어'
        const p2 = new RegExp(SQ + SQ + '\\s+' + SQ + '([^' + SQ + ']+' + SQ + ')', 'g');
        newLine = newLine.replace(p2, (match, g1) => {
            fixes++;
            return SQ + g1;
        });

        // Pattern 3: Korean text' 'Korean text (mid-JSX text break)
        // Like: 데이' '확인할 → 데이터 확인할
        const p3 = new RegExp('([' + K + '])' + SQ + '\\s+' + SQ + '([' + K + '?\\ufffd])', 'g');
        newLine = newLine.replace(p3, (match, g1, g2) => {
            fixes++;
            return g1 + ' ' + g2;
        });

        // Pattern 4: Broken ternary after identifier
        // editingAd ' '(text)' → editingAd ? '(text)'
        const p4 = new RegExp('(\\w+)\\s+' + SQ + '\\s+' + SQ + '(\\()', 'g');
        newLine = newLine.replace(p4, (match, g1, g2) => {
            if (/^[a-z][a-zA-Z0-9]*$/.test(g1)) {
                fixes++;
                return g1 + ' ? ' + SQ + g2;
            }
            return match;
        });

        // Pattern 5: ' ' in JSX text (e.g. isPK && '' ') - the key emoji one
        // {isPK && '' '}{col.Field}
        const p5 = new RegExp(SQ + SQ + '\\s+' + SQ + '\\}', 'g');
        newLine = newLine.replace(p5, (match) => {
            fixes++;
            return SQ + '\uD83D\uDD11 ' + SQ + '}';
        });

        lines[i] = newLine;
    }

    if (fixes > 0) {
        const newContent = lines.join('\n');
        fs.writeFileSync(absPath, newContent, 'utf8');
        console.log(`Fixed ${fixes} patterns in ${relPath}`);
        totalFixes += fixes;
        results.push({ file: relPath, fixes });
    } else {
        console.log(`No fixable patterns in ${relPath}`);
    }
});

console.log(`\n========================================`);
console.log(`Total fixes applied: ${totalFixes}`);
console.log(`Files modified: ${results.length}`);
results.forEach(r => console.log(`  ${r.file}: ${r.fixes} fixes`));
