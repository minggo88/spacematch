const fs = require('fs');
const path = require('path');
const glob = require('path');

// Find all JSX files in src/
function findJSXFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && item.name !== 'node_modules' && item.name !== '.git') {
            results.push(...findJSXFiles(fullPath));
        } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.js'))) {
            results.push(fullPath);
        }
    }
    return results;
}

const srcDir = path.join(__dirname, 'src');
const files = findJSXFiles(srcDir);

let totalFixes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let orig = content;
    let fixes = [];
    const relPath = path.relative(__dirname, file);

    // Pattern 1: Fix broken placeholder/attribute values like: placeholder="?" "actual text"
    // This pattern comes from: "한글" being corrupted to "?" "
    const brokenAttrPattern = /="(\?)" "([^"]*)"/g;
    let match;
    while ((match = brokenAttrPattern.exec(content)) !== null) {
        fixes.push(`  BROKEN_ATTR: ="${match[1]}" "${match[2]}" → ="${match[2]}"`);
    }
    content = content.replace(/="(\?)" "([^"]*)"/g, '="$2"');

    // Pattern 2: Fix unclosed template literals like: `${x}? where backtick is missing
    // Common pattern: `${variable}명` corrupted to `${variable}?
    // Also: ` / ${max}명` corrupted to ` / ${max}�? or ` / ${max}?

    // Pattern 2a: `${expr}? at end of ternary (before : '')
    content = content.replace(/`\$\{([^}]+)\}[?�]+ *: ''/g, (m, expr) => {
        fixes.push(`  UNCLOSED_TMPL: ${m.substring(0, 60)} → \`\${${expr}}명\` : ''`);
        return `\`\${${expr}}\uBA85\` : ''`;
    });

    // Pattern 2b: `${expr}명` where 명 is corrupted: `${expr}???`;  or `${expr}????`;
    // Look for return `${var}CORRUPTED`;  patterns
    const lines = content.split('\n');
    const fixedLines = lines.map((line, idx) => {
        // Fix: return `${mins}???`;  → return `${mins}분 전`;
        if (line.match(/return `\$\{[^}]+\}[?]+`\s*;/)) {
            // Already fixed in VendorApplications, skip if already clean
        }

        // Fix lines with `${expr}?  (missing closing backtick before ;)
        // Pattern: `${var}GARBLED; where there should be a closing backtick
        let fixed = line.replace(/`\$\{([^}]+)\}([?�]+)\s*;/g, (m, expr, garbled) => {
            fixes.push(`  LINE ${idx + 1}: ${m.substring(0, 60)} → \`\${${expr}}\uBA85\`;`);
            return `\`\${${expr}}\uBA85\`;`;
        });

        return fixed;
    });
    content = fixedLines.join('\n');

    // Pattern 3: Fix stray apostrophes that break JSX
    // Pattern: }' {   (stray quote after closing brace before JSX)
    content = content.replace(/\}' \{/g, (m) => {
        fixes.push(`  STRAY_QUOTE: }' { → } {`);
        return '} {';
    });

    // Pattern: text' </tag>  (stray quote before closing tag)
    // But be careful not to catch legitimate quotes in strings
    // Only fix when preceded by Korean/garbled text and followed by </
    content = content.replace(/([가-힣?�]+)' <\//g, (m, before) => {
        fixes.push(`  STRAY_QUOTE: ${m.substring(0, 40)} → ${before} </`);
        return `${before} </`;
    });

    // Pattern: 광고 ?' → 광고  (stray ?' in Korean text)
    content = content.replace(/([가-힣]) \?'([^']*[가-힣])/g, (m, before, after) => {
        fixes.push(`  STRAY_QM_QUOTE: ${m.substring(0, 40)}`);
        return `${before} ${after}`;
    });

    // Pattern 4: 최' → 최대  (corrupted Korean character followed by stray quote)
    content = content.replace(/최' /g, '최대 ');

    if (content !== orig) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`\n${relPath}: ${fixes.length} fixes applied`);
        fixes.forEach(f => console.log(f));
        totalFixes += fixes.length;
    }
});

console.log(`\n=== Total fixes: ${totalFixes} ===`);
