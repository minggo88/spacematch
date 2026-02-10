/**
 * Aggressive fix for ALL stray apostrophes in corrupted Korean text.
 * Strategy: If a line has an odd number of single quotes, find and fix the 
 * stray one by looking at common corruption patterns.
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
            } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.tsx') || item.name.endsWith('.js'))) {
                results.push(full);
            }
        }
    } catch { }
    return results;
}

function countSingleQuotes(line) {
    let count = 0;
    let inTemplate = false;
    let inDouble = false;
    let escaped = false;
    for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        if (escaped) { escaped = false; continue; }
        if (ch === '\\') { escaped = true; continue; }
        if (ch === '`') inTemplate = !inTemplate;
        if (ch === '"' && !inTemplate) inDouble = !inDouble;
        if (ch === "'" && !inTemplate && !inDouble) count++;
    }
    return count;
}

const files = findJsxFiles(srcDir);
let totalFixes = 0;
let unfixed = [];

files.forEach(filePath => {
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    const relPath = path.relative(__dirname, filePath);
    let fileFixes = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        const trimmed = line.trim();

        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;

        const sqCount = countSingleQuotes(line);
        if (sqCount % 2 === 0) continue;

        let fixed = line;
        let didFix = false;

        // Pattern 1: Korean/corrupted-char ' followed by non-quote char before </  or  at end
        // e.g.: "마세요' </p>" -> "마세요 </p>" or "초기' </button>" -> "초기화 </button>"  
        // The stray quote appears between corrupt Korean fragment and JSX close
        if (fixed.match(/[\?\uAC00-\uD7AF]\'\s*<\//)) {
            fixed = fixed.replace(/([\?\uAC00-\uD7AF])\'\s*(<\/)/g, '$1$2');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line; // revert
        }

        // Pattern 2: Korean/corrupted-char ' at end of JSX text content before }
        // e.g.: "?든 공간' " -> "모든 공간 " 
        if (!didFix && fixed.match(/[\?\uAC00-\uD7AF]\'\s*[\}]/)) {
            fixed = fixed.replace(/([\?\uAC00-\uD7AF])\'\s*([\}])/g, '$1$2');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 3: ' after question mark in JSX text 
        // Pattern like: 있으신가요' </span>
        if (!didFix && fixed.match(/\?\'\s/)) {
            fixed = fixed.replace(/\?\'\s/g, '? ');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 4: 메시' (stray quote after corrupted Korean, before space)
        // e.g.: "메시' <span" -> "메시지 <span"
        if (!didFix && fixed.match(/[\uAC00-\uD7AF]\'\s+</)) {
            fixed = fixed.replace(/([\uAC00-\uD7AF])\'\s+(<)/g, '$1 $2');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 5: stray ' followed by closing paren or bracket
        // e.g.: "발생했습니다.'\)" -> fix quote
        if (!didFix && fixed.match(/[\?\uAC00-\uD7AF]\'\)/)) {
            fixed = fixed.replace(/([\?\uAC00-\uD7AF])\'\)/g, '$1)');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 6: '' (double-open-single-quote) at start of string value
        // e.g.: showToast('' 오류가...',  -> showToast('오류가...',
        if (!didFix && fixed.includes("'' ")) {
            fixed = fixed.replace(/''\s+/g, "'");
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 7: ?→') - stray quote inside parenthetical Korean text  
        // e.g.: "이름순(가→')" -> "이름순(가→ㅎ)"
        if (!didFix && fixed.match(/→\'\)/)) {
            fixed = fixed.replace(/→\'\)/g, '→ㅎ)');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 8: Generic - if there's a ' that's NOT part of a string delimiter pair,
        // it's likely a stray. Remove the first stray ' that follows a ? or Korean char
        if (!didFix && fixed.match(/[\?\uAC00-\uD7AF]'/)) {
            // Try removing the first such occurrence
            fixed = fixed.replace(/([\?\uAC00-\uD7AF])'/, '$1');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 9: ' before Korean text at start of JSX text content
        // e.g.: >' 공유하기</p>  -> >공유하기</p>
        if (!didFix && fixed.match(/>\'\s+[\?\uAC00-\uD7AF]/)) {
            fixed = fixed.replace(/>'\s+([\?\uAC00-\uD7AF])/g, '>$1');
            if (countSingleQuotes(fixed) % 2 === 0) { didFix = true; }
            else fixed = line;
        }

        // Pattern 10: Don't notifications or comments with legitimate apostrophes
        if (!didFix && (line.includes("we've") || line.includes("Don't") || line.includes("can't") || line.includes("won't"))) {
            continue; // Skip - legitimate English contractions
        }

        if (didFix) {
            lines[i] = fixed;
            fileFixes++;
            totalFixes++;
        } else {
            unfixed.push({ file: relPath, line: lineNum, content: trimmed.substring(0, 120) });
        }
    }

    if (fileFixes > 0) {
        fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
        console.log(`SAVED ${relPath} (${fileFixes} fixes)`);
    }
});

console.log(`\nTotal fixes: ${totalFixes}`);
console.log(`\nUnfixed odd-quote lines (${unfixed.length}):`);
unfixed.forEach(u => {
    console.log(`  ${u.file}:${u.line}: ${u.content}`);
});
