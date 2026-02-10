/**
 * Find all lines that have potential syntax-breaking patterns.
 * Specifically targets:
 * 1. Unclosed string literals (odd number of quotes on a line)
 * 2. JSX attributes missing closing quotes
 * 3. Stray quotes breaking strings
 */
const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/admin/AdminVenues.jsx',
    'src/pages/admin/AdminAds.jsx',
    'src/pages/vendor/VendorVenues.jsx',
    'src/pages/vendor/VendorApplications.jsx',
    'src/pages/seller/SellerProfile.jsx',
    'src/pages/seller/SellerApplications.jsx',
    'src/pages/RecruitmentDashboard.jsx',
];

files.forEach(relPath => {
    const filePath = path.join(__dirname, relPath);
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const issues = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        // Skip comment lines
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

        // Check for unclosed JSX attributes: title="..." where the closing " is missing
        // Pattern: attribute="text that doesn't end with " before >
        const attrMatch = line.match(/(\w+)="([^"]*?)>/);
        if (attrMatch && !attrMatch[2].endsWith('"')) {
            // Could be a legitimate self-closing tag or the quote was consumed
            // Check if the text after = has corrupted content (?) 
            if (attrMatch[2].includes('?') && !attrMatch[2].includes('"')) {
                issues.push({ line: lineNum, type: 'unclosed-attr', content: line.trim().substring(0, 120) });
            }
        }

        // Check for lines where single quotes don't balance properly
        // Count single quotes outside of template literals and JSX expressions
        let singleQuotes = 0;
        let inTemplate = false;
        let inDouble = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '`') inTemplate = !inTemplate;
            if (ch === '"' && !inTemplate) inDouble = !inDouble;
            if (ch === "'" && !inTemplate && !inDouble) singleQuotes++;
        }
        if (singleQuotes % 2 !== 0) {
            issues.push({ line: lineNum, type: 'odd-single-quotes', count: singleQuotes, content: line.trim().substring(0, 120) });
        }

        // Check for stray '' pattern (empty string fragment)
        if (line.includes("'' '") || line.includes("' ''")) {
            issues.push({ line: lineNum, type: 'stray-empty-string', content: line.trim().substring(0, 120) });
        }

        // Check for broken JSX fragment: ?/>  or  ??/>
        if (/\?\s*\/>/.test(line) && !line.includes('?.')) {
            issues.push({ line: lineNum, type: 'broken-jsx-close', content: line.trim().substring(0, 120) });
        }
    });

    if (issues.length > 0) {
        console.log(`\n=== ${relPath} (${issues.length} potential issues) ===`);
        issues.forEach(iss => {
            console.log(`  L${iss.line} [${iss.type}] ${iss.content}`);
        });
    }
});
