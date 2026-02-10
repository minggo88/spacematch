/**
 * Fix remaining build-breaking syntax errors after initial cleanup.
 * Handles right-single-quote (U+2019) inside single-quoted strings,
 * stray quotes in strings, and other patterns.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Process ALL .jsx files recursively
function findJsxFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const full = path.join(dir, item.name);
        if (item.isDirectory() && item.name !== 'node_modules') {
            results.push(...findJsxFiles(full));
        } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.tsx'))) {
            results.push(full);
        }
    }
    return results;
}

const files = findJsxFiles(srcDir);
let totalFixes = 0;

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let fixes = 0;
    const relPath = path.relative(__dirname, filePath);

    // Fix 1: Replace U+2019 (right single quote) with regular apostrophe
    // This character inside regular single-quoted strings breaks the parser
    const rsq = /\u2019/g;
    const rsqCount = (content.match(rsq) || []).length;
    if (rsqCount > 0) {
        content = content.replace(rsq, "'");
        fixes += rsqCount;
        console.log(`  [${relPath}] Fixed ${rsqCount} right-single-quote chars`);
    }

    // Fix 2: Replace U+2018 (left single quote) with regular apostrophe
    const lsq = /\u2018/g;
    const lsqCount = (content.match(lsq) || []).length;
    if (lsqCount > 0) {
        content = content.replace(lsq, "'");
        fixes += lsqCount;
        console.log(`  [${relPath}] Fixed ${lsqCount} left-single-quote chars`);
    }

    // Fix 3: Replace U+201C/U+201D (curly double quotes) with regular double quotes
    const cdq = /[\u201C\u201D]/g;
    const cdqCount = (content.match(cdq) || []).length;
    if (cdqCount > 0) {
        content = content.replace(cdq, '"');
        fixes += cdqCount;
        console.log(`  [${relPath}] Fixed ${cdqCount} curly-double-quote chars`);
    }

    // Fix 4: Fix '' (two single quotes where one string ends and another begins mid-word)
    // Pattern: '..text..' '..more text..'  ->  '..text.. ..more text..'
    // Specifically targets: closing-quote space(s) opening-quote inside what should be a single string
    // This is tricky - only fix when the context indicates it was a single string split by corruption
    // Look for: Korean-char ' ' Korean-char pattern
    const midQuote = /([\u3131-\uD79D\?])\'\s*\'([\u3131-\uD79D\?])/g;
    const mqCount = (content.match(midQuote) || []).length;
    if (mqCount > 0) {
        content = content.replace(midQuote, '$1 $2');
        fixes += mqCount;
        console.log(`  [${relPath}] Fixed ${mqCount} mid-string apostrophe patterns`);
    }

    if (fixes > 0 && content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  SAVED ${relPath} with ${fixes} total fixes`);
        totalFixes += fixes;
    }
});

console.log(`\nTotal fixes applied: ${totalFixes}`);
