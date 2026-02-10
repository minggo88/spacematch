/**
 * Comprehensive fix: Find all lines with unclosed template literals (backticks)
 * and unbalanced single-quote strings across ALL .jsx files.
 * This script identifies and reports (but carefully fixes) these patterns.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findJsxFiles(dir) {
    const results = [];
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const full = path.join(dir, item.name);
            if (item.isDirectory() && item.name !== 'node_modules') {
                results.push(...findJsxFiles(full));
            } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.tsx'))) {
                results.push(full);
            }
        }
    } catch { }
    return results;
}

const files = findJsxFiles(srcDir);
let totalFixes = 0;

files.forEach(filePath => {
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    const relPath = path.relative(__dirname, filePath);
    let fileFixes = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;

        // Skip pure comments
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;

        // PATTERN 1: Unclosed template literal ending with ;
        // e.g.: `${mins}분 전`;  became  `${mins}???;  (missing closing backtick)
        // Detect: line has backtick opening but no closing backtick
        const backtickCount = (line.match(/`/g) || []).length;
        if (backtickCount === 1 && line.includes('`$') && line.trimEnd().endsWith(';')) {
            // This is an unclosed template literal return statement
            // Find the opening backtick position and add closing backtick before ;
            const lastSemicolon = line.lastIndexOf(';');
            const newLine = line.substring(0, lastSemicolon) + '`' + line.substring(lastSemicolon);
            lines[i] = newLine;
            fileFixes++;
            console.log(`  L${lineNum}: Fixed unclosed template literal`);
        }

        // PATTERN 2: Template literal return with odd backtick count (3 backticks where 2 expected)
        // This shouldn't normally happen but check

        // PATTERN 3: Odd single-quote count on a single line (outside template literals)
        // Count quotes properly, excluding backslash-escaped ones and those in template/double-quoted strings
        let singleQuotes = 0;
        let inTemplate = false;
        let inDouble = false;
        let escaped = false;
        for (let j = 0; j < line.length; j++) {
            const ch = line[j];
            if (escaped) { escaped = false; continue; }
            if (ch === '\\') { escaped = true; continue; }
            if (ch === '`') inTemplate = !inTemplate;
            if (ch === '"' && !inTemplate) inDouble = !inDouble;
            if (ch === "'" && !inTemplate && !inDouble) singleQuotes++;
        }

        if (singleQuotes % 2 !== 0) {
            // Try to auto-fix common patterns:

            // Pattern A: String starting with '' (empty string + space + continuation)
            // e.g.: showToast('' error message', 'error')
            if (line.includes("'' ") && !line.includes("''s") && !line.includes("''t")) {
                const fixed = line.replace(/'\s*'\s+([^']*?)'/g, (match, inner) => {
                    return "'" + inner.trim() + "'";
                });
                if (fixed !== line) {
                    lines[i] = fixed;
                    fileFixes++;
                    console.log(`  L${lineNum}: Fixed empty-string-continuation pattern`);
                    continue;
                }
            }

            // Pattern B: Stray quote after Korean text before closing tag
            // e.g.: 활성화</> : <>...활성화'/>}  or similar
            // Check if the line contains ?'/> or ?' /> or similar JSX-breaking patterns
            if (/\?\s*'\s*\/?>/.test(line)) {
                // Remove the stray quote
                const fixed = line.replace(/(\?)\s*'\s*(\/?>)/g, '$1$2');
                if (fixed !== line) {
                    lines[i] = fixed;
                    fileFixes++;
                    console.log(`  L${lineNum}: Fixed stray quote before JSX close`);
                    continue;
                }
            }

            // Report unfixed
            if (singleQuotes % 2 !== 0) {
                // Check if still odd after attempted fixes
                let sq2 = 0;
                let it2 = false;
                let id2 = false;
                let esc2 = false;
                for (let j = 0; j < lines[i].length; j++) {
                    const ch = lines[i][j];
                    if (esc2) { esc2 = false; continue; }
                    if (ch === '\\') { esc2 = true; continue; }
                    if (ch === '`') it2 = !it2;
                    if (ch === '"' && !it2) id2 = !id2;
                    if (ch === "'" && !it2 && !id2) sq2++;
                }
                if (sq2 % 2 !== 0) {
                    console.log(`  L${lineNum}: UNFIXED odd quotes (${sq2}): ${lines[i].trim().substring(0, 100)}`);
                }
            }
        }
    }

    if (fileFixes > 0) {
        fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
        console.log(`SAVED ${relPath} (${fileFixes} fixes)\n`);
        totalFixes += fileFixes;
    }
});

console.log(`\nTotal fixes: ${totalFixes}`);
