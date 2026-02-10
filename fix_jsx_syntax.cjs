const fs = require('fs');
const path = require('path');

// This script fixes JSX syntax errors caused by corrupted Korean text.
// The corruption pattern: some UTF-8 Korean character bytes got lost,
// causing JSX syntax characters (<, >, ", ', /) to be consumed.
//
// Common broken patterns:
// 1. "Korean??/tagname>" -> should be "Korean</tagname>" (missing <)
// 2. 'attribute="Korean�?' -> should be 'attribute="Korean"' (missing closing ")
// 3. "Korean??text" inside JSX strings with unterminated quotes

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

function fixCorruptedJsx(content, filePath) {
    let fixed = content;
    let changes = [];

    // Pattern 1: Corrupted closing tags
    // e.g., "Korean??/h1>" or "Korean??/span>" or "Korean??/button>" etc.
    // The < was consumed by corrupted Korean text
    const closingTagPattern = /([^\s<>\/])(\/(?:div|span|h[1-6]|p|button|a|li|ul|ol|table|thead|tbody|tr|td|th|label|select|option|input|form|section|header|footer|nav|main|article|aside|Link)>)/g;
    let match;
    while ((match = closingTagPattern.exec(fixed)) !== null) {
        // Check if the character before / is not < (which means it's corrupted)
        if (match[1] !== '<') {
            // Find the start of the corrupted Korean text before this
            const beforeIdx = match.index;
            // Look back to find where the Korean text starts (non-ASCII or ? chars)
            let startIdx = beforeIdx;
            while (startIdx > 0 && (fixed[startIdx - 1] === '?' || fixed.charCodeAt(startIdx - 1) > 127 || fixed[startIdx - 1] === '\ufffd')) {
                startIdx--;
            }

            // Replace the corrupted text + broken closing tag with just the closing tag
            const corrupted = fixed.substring(startIdx, match.index + match[0].length);
            const replacement = '<' + match[2];
            changes.push(`  Line ~${getLineNumber(fixed, match.index)}: "${corrupted.substring(0, 30)}..." -> "${replacement}"`);
        }
    }

    // Apply Pattern 1 fixes
    fixed = fixed.replace(/([^<\s])\?(\/(?:div|span|h[1-6]|p|button|a|li|ul|ol|table|thead|tbody|tr|td|th|label|select|option|input|form|section|header|footer|nav|main|article|aside|Link)>)/g,
        (match, before, tag) => '<' + tag);

    // More aggressive: find any sequence of garbled chars before /tagname>
    fixed = fixed.replace(/[\?\ufffd\u0080-\uffff]{1,20}(\/(?:div|span|h[1-6]|p|button|a|li|ul|ol|table|thead|tbody|tr|td|th|label|select|option|input|form|section|header|footer|nav|main|article|aside|Link)>)/g,
        (match, tag) => '<' + tag);

    // Pattern 2: Unterminated string literals in JSX attributes
    // e.g., unit="�? or label="Korean�? or title="Korean??
    // The closing " was consumed
    fixed = fixed.replace(/((?:unit|label|title|placeholder|alt|className)="[^"]*?)[\?\ufffd](["\s\n\r])/g, '$1"$2');
    fixed = fixed.replace(/((?:unit|label|title|placeholder|alt|className)="[^"]*?)[\?\ufffd]$/gm, '$1"');

    // Pattern 3: Unterminated JSX string expressions
    // e.g., {'Korean?? } or 'Korean?? :
    // Fix unterminated single-quoted strings
    fixed = fixed.replace(/('[^']*?)[\?\ufffd]{1,4}\s*([\s:;})\]])/g, (match, start, after) => {
        return start + "'" + after;
    });

    // Pattern 4: Broken closing tags where partial Korean consumed the <
    // Look for lines that have text immediately followed by /tagname> without <
    const lines = fixed.split('\n');
    const fixedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Fix: sometext??/tag> -> sometext</tag>
        line = line.replace(/([^<\s])(\/)?(h[1-6]|span|div|p|button|th|td|a|li|label|select|option)>/g, (match, before, slash, tag) => {
            if (slash) {
                // It's like: x/span> -> should be </span>
                return before + '</' + tag + '>';
            }
            return match;
        });

        fixedLines.push(line);
    }
    fixed = fixedLines.join('\n');

    // Pattern 5: Fix "unit=" attributes with corrupted value
    // e.g., unit="�?\n -> unit={"\uac1c"}\n
    fixed = fixed.replace(/unit="[^"]*?[\?\ufffd][^"]*$/gm, 'unit={"\uac1c"}');

    // Pattern 6: Fix {' text??/component> patterns  
    fixed = fixed.replace(/(>)[^\n<]*?[\?\ufffd]+\s*?(\/(?:div|span|h[1-6]|p|button|a|Link)>)/g, '$1<$2');

    return { content: fixed, changes };
}

function getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
}

// Main
const srcDir = path.join(__dirname, 'src');
const files = findJsxFiles(srcDir);

console.log(`Found ${files.length} JSX files to check.\n`);

let totalFixes = 0;
for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { content: fixed, changes } = fixCorruptedJsx(content, file);

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log(`FIXED: ${relPath} (${changes.length} patterns)`);
        totalFixes++;
    }
}

console.log(`\nTotal files fixed: ${totalFixes}`);
console.log('\nNow attempting build to check for remaining errors...');
