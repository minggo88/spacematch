const fs = require('fs');
const path = require('path');

// FINAL PASS: Replace ALL remaining instances of corrupted ternary operators.
// Strategy: use esbuild to CHECK each file, and if it fails, find and fix ' -> ?

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

    // Very aggressive: find all standalone ' (apostrophe surrounded by spaces/newline)
    // that are NOT inside string literals, and replace with ?
    // Using a heuristic: ' preceded by identifier/bracket and followed by code

    // Process each line
    const lines = fixed.split('\n');
    const fixedLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let inString = false;
        let stringChar = null;
        let result = '';

        for (let j = 0; j < line.length; j++) {
            const ch = line[j];
            const prev = j > 0 ? line[j - 1] : '';
            const next = j < line.length - 1 ? line[j + 1] : '';

            if (inString) {
                result += ch;
                if (ch === stringChar && prev !== '\\') {
                    inString = false;
                    stringChar = null;
                }
                continue;
            }

            // Check if we're entering a string
            if (ch === '"' || ch === '`') {
                inString = true;
                stringChar = ch;
                result += ch;
                continue;
            }

            // For single quotes: check if this is a corrupted ternary
            if (ch === "'") {
                // Check if this looks like a ternary operator (surrounded by spaces)
                if (prev === ' ' && next === ' ') {
                    // Look at what comes after: if it's code-like, it's a ternary
                    const after = line.substring(j + 2).trim();
                    const before = line.substring(0, j).trim();

                    // Heuristic: if the thing after is an identifier, string, array, object,
                    // JSX, or the before ends with an identifier/closing bracket
                    if (/^[a-zA-Z_$'{[\(<`!]/.test(after) &&
                        /[a-zA-Z_$)\]'"0-9]$/.test(before)) {
                        // But make sure this isn't a legitimate string delimiter
                        // Count unmatched single quotes on this line before this position
                        // If odd, this closes a string; if even, it's standalone
                        let quoteCount = 0;
                        for (let k = 0; k < j; k++) {
                            if (line[k] === "'" && (k === 0 || line[k - 1] !== '\\')) {
                                quoteCount++;
                            }
                        }

                        if (quoteCount % 2 === 0) {
                            // Even number of quotes before = this is standalone = corrupted ternary
                            result += '?';
                            fixCount++;
                            continue;
                        }
                    }
                }

                // Regular single quote (string delimiter)
                inString = true;
                stringChar = ch;
                result += ch;
                continue;
            }

            result += ch;
        }

        fixedLines.push(result);
    }

    fixed = fixedLines.join('\n');

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath} (${fixCount} ternary operators)`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
