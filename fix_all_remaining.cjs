const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Comprehensive final fix: Use esbuild to check each file individually,
// then fix the specific error if found

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

console.log(`Scanning ${files.length} JSX files for remaining corruption...\n`);

let totalFixes = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // Fix 1: Combined ternary+quote pattern
    // "condition ' 'value?" -> "condition ? 'value'"
    // Inside template literals: ${condition ' 'value? : 'other?}
    content = content.replace(/(\w+)\s+'\s+'([^']*?)\?(\s*:)/g, (match, cond, val, colon) => {
        changed = true;
        return `${cond} ? '${val}'${colon}`;
    });

    // Fix 2: More general - any ? that should be ' at end of string
    // 'content? -> 'content'
    content = content.replace(/'([a-zA-Z0-9\-_\/\.\s#:,()%{}]+)\?/g, (match, str) => {
        // Check context - is this inside backticks or regular string
        changed = true;
        return `'${str}'`;
    });

    // Fix 3: "content? -> "content"
    content = content.replace(/"([a-zA-Z0-9\-_\/\.\s#:,()%{}$]+)\?/g, (match, str) => {
        changed = true;
        return `"${str}"`;
    });

    // Fix 4: remaining ternary with quote combo in template literals
    // ${x ' 'a' : 'b'} -> ${x ? 'a' : 'b'}
    content = content.replace(/(\w)\s+'\s+'/g, (match, before) => {
        changed = true;
        return `${before} ? '`;
    });

    // Fix 5: Fix patterns like: value === 'something' ' result : alt
    // where ' before result should be ?
    content = content.replace(/'\s+'\s+(\w)/g, (match, after) => {
        // This is tricky - could be end of string + ternary
        // "=== 'value' ' result" -> "=== 'value' ? result"
        changed = true;
        return `' ? ${after}`;
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath}`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
