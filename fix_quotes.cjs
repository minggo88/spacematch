const fs = require('fs');
const path = require('path');

// Fix corrupted closing quotes: the encoding corruption turned closing ' into ?
// Pattern: 'some-text? should be 'some-text'
// Also: 'some-text??should be 'some-text' (with extra garbled chars)

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

    // Pattern 1: 'string-content? -> 'string-content'
    // The ? at the end of a CSS class or similar string should be '
    fixed = fixed.replace(/'([a-zA-Z0-9\-_\/\.\s#:,()%]+)\?(\s*[},\]\)])/g, (match, str, after) => {
        fixCount++;
        return `'${str}'${after}`;
    });

    // Pattern 2: 'string-content?? -> 'string-content'  (double garbled)
    fixed = fixed.replace(/'([a-zA-Z0-9\-_\/\.\s#:,()%]+)\?\?(\s*[},\]\)])/g, (match, str, after) => {
        fixCount++;
        return `'${str}'${after}`;
    });

    // Pattern 3: "string-content? -> "string-content"
    fixed = fixed.replace(/"([a-zA-Z0-9\-_\/\.\s#:,()%{}$`]+)\?(\s*[>}\]\)])/g, (match, str, after) => {
        fixCount++;
        return `"${str}"${after}`;
    });

    // Pattern 4: Fix alert and console messages with garbled Korean
    // e.g., alert('' + garbled) -> alert('error message')

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath} (${fixCount} closing quotes)`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
