const fs = require('fs');
const path = require('path');

// Fix corrupted ternary operators across all JSX files
// The encoding corruption turned ? into ' in some contexts
// Pattern: "expression ' value : value" should be "expression ? value : value"

function findJsxFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist' && item.name !== '.git') {
            results.push(...findJsxFiles(fullPath));
        } else if (item.name.endsWith('.jsx') || item.name.endsWith('.tsx') || item.name.endsWith('.js')) {
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

    // Fix ternary operators: "expression ' value : value" -> "expression ? value : value"
    // The pattern is: some_expression<space>'<space>[{value
    // We need to be careful not to replace legitimate single quotes

    // Pattern: identifier/paren ' <space/newline>{/[/"/' followed by : somewhere after
    // Specific patterns seen in the codebase:

    // 1. "=== 'string' ' value : value" -> "=== 'string' ? value : value"
    fixed = fixed.replace(/('[\w]+') ' (\[?\{?)/g, (match, str, after) => {
        fixCount++;
        return `${str} ? ${after}`;
    });

    // 2. ") ' value : value" -> ") ? value : value"
    fixed = fixed.replace(/\) ' (\{|\[|'|"|`)/g, (match, after) => {
        fixCount++;
        return `) ? ${after}`;
    });

    // 3. "variable ' value : value" in map/filter contexts
    fixed = fixed.replace(/([\w\]]) ' (\{ \.\.\.)/g, (match, before, after) => {
        fixCount++;
        return `${before} ? ${after}`;
    });

    // 4. General pattern: word/bracket ' <space> followed by typical ternary value starts
    fixed = fixed.replace(/([\w\]\)'"]) ' (\(|<|true|false|null|undefined|''|""|`)/g, (match, before, after) => {
        fixCount++;
        return `${before} ? ${after}`;
    });

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath} (${fixCount} ternary operators)`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
