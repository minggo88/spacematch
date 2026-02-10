const fs = require('fs');
const path = require('path');

// More aggressive fix for corrupted ternary operators
// The corruption turned ? into ' (apostrophe/single-quote)
// Strategy: Find ALL standalone ' that look like ternary operators

function findJsxFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist' && item.name !== '.git') {
            results.push(...findJsxFiles(fullPath));
        } else if (item.name.endsWith('.jsx') || item.name.endsWith('.tsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

const srcDir = path.join(__dirname, 'src');
const files = findJsxFiles(srcDir);
let totalFixes = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let fixed = content;
    let fixCount = 0;

    // Process line by line for better context
    const lines = fixed.split('\n');
    const fixedLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Pattern: line starts with spaces then ' followed by code that looks like ternary
        // e.g., "          ' user.role === ..." or "              ' '/admin'"
        // These are lines where ? was at the start of the expression continuation
        if (/^\s+' /.test(line) && !line.trim().startsWith("'use ")) {
            // Check context: is this likely a ternary continuation?
            const prevLine = i > 0 ? lines[i - 1].trim() : '';
            const nextLines = lines.slice(i + 1, i + 5).map(l => l.trim()).join(' ');

            // If the line starts with ' and there's a : somewhere after, it's likely ternary
            if (line.includes(':') || nextLines.includes(':') || prevLine.endsWith('?') === false) {
                line = line.replace(/^(\s+)' /, '$1? ');
                fixCount++;
            }
        }

        // Pattern: " ' " in the middle of expressions (not inside strings)
        // Be more aggressive: any ' that's surrounded by spaces and preceded by
        // an identifier, string, or closing bracket is likely a corrupted ?

        // Replace ' that appears between expressions as ternary
        // "something ' something_else : alternative"
        // But be careful not to replace actual string delimiters

        // Specific pattern: "variable\n    ' value" spread across lines
        // Already handled above

        // Pattern: inline corrupted ternary like "condition ' result : alt"
        // Find ' that has a corresponding : on the same line
        line = line.replace(/(\b(?:true|false|null|undefined|\d+)\s*)' /g, (match, before) => {
            fixCount++;
            return before + '? ';
        });

        fixedLines.push(line);
    }

    fixed = fixedLines.join('\n');

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath} (${fixCount} fixes)`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
