const fs = require('fs');
const path = require('path');

// Fix pattern: inside single-quoted strings, an apostrophe appears where it shouldn't,
// prematurely ending the string. This happens when Korean bytes get corrupted.
//
// Pattern to detect: 'Korean' Korean -> 'Korean Korean' (join the split pieces)
// Example: setError('데이' 불러오는...) -> setError('데이터를 불러오는...')
//
// BUT we can't know the original Korean, so we just need to remove the syntax error.
// Strategy: Find cases where 'text' is immediately followed by Korean/word chars
// without an operator in between, and merge them into one string.

function findJsxFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && !['node_modules', 'dist', '.git'].includes(item.name)) {
            results.push(...findJsxFiles(fullPath));
        } else if (item.name.endsWith('.jsx') || item.name.endsWith('.tsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

const APOS = String.fromCharCode(39);

function fixFile(content) {
    let fixCount = 0;

    // Pattern: 'text' followed immediately by Korean/word characters (not operators)
    // This is ' text' word -> should be 'text word' (the middle ' is corruption)

    // Regex approach: find 'string' followed by space then Korean chars then more content until '
    // A corrupted mid-string ' looks like: 'partial1' partial2...'
    // We need to remove the middle ' and join the parts

    // Match: single-quoted string followed by space and Korean/word that ends in another '
    // Be careful not to match legitimate patterns like ternary results

    // Specific pattern: inside a function call like alert(' or showToast(' or setError('
    // the string has a corrupted ' that splits it

    // Simple heuristic: If we see 'text' followed by a space and then non-operator chars
    // that eventually end in another single quote or closing paren,
    // and the 'text' is short (Korean chars), it's likely corruption

    // Let's use a line-by-line approach
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
        // Pattern: 'Korean' Korean => should be 'KoreanKorean'
        // e.g., '데이' 불러오는 -> '데이터를 불러오는
        // The corrupted ' after Korean chars, followed by space and more Korean

        // Match: (Korean+)' (space)(Korean chars continuing until ')
        // This catches ' in the MIDDLE of what should be one quoted string

        let fixed = line;

        // Pattern: Inside quotes context - 'text' moretext...'  ->  'text moretext...'
        // Detect: sequence like  ('some Korean' more Korean words') where first ' ends prematurely
        // We look for: Korean char followed by ' followed by space followed by Korean/letter
        // where earlier in the line there's a matching opening '

        // Use a simple pattern: <Korean>' <Korean/letter> 
        // where the ' is corruption (should be a Korean char)
        // Replace the ' with empty or the missing char

        // Since we can't recover the original char, just remove the corrupted '
        // This makes 'text' moretext' -> 'text moretext' (one string)

        // Regex: match Korean char + ' + space + Korean/letter continuation
        const koreanRange = /[\uAC00-\uD7A3\u3131-\u314E\u314F-\u3163]/;

        let result = [];
        let i = 0;
        let inSingleStr = false;
        let inDoubleStr = false;

        while (i < fixed.length) {
            const ch = fixed[i];
            const prev = i > 0 ? fixed[i - 1] : '';
            const next = i < fixed.length - 1 ? fixed[i + 1] : '';

            if (ch === '"' && !inSingleStr) {
                if (inDoubleStr && prev !== '\\') inDoubleStr = false;
                else if (!inDoubleStr) inDoubleStr = true;
                result.push(ch);
                i++;
                continue;
            }

            if (inDoubleStr) {
                result.push(ch);
                i++;
                continue;
            }

            if (ch === APOS) {
                if (inSingleStr) {
                    // Check if this ' is a corrupted mid-string character
                    // Indicator: preceded by Korean AND followed by space then Korean/letter
                    if (koreanRange.test(prev) && next === ' ') {
                        // Look ahead to see if there's Korean/letter content
                        const rest = fixed.substring(i + 2);
                        // If rest starts with Korean or word chars, this ' is corruption
                        if (/^[\uAC00-\uD7A3\u3131-\u314E\u314F-\u3163a-zA-Z]/.test(rest)) {
                            // Skip this corrupted ' - don't close the string
                            // Replace with empty (or a space since we keep the space after)
                            fixCount++;
                            i++; // skip the corrupted '
                            continue;
                        }
                    }
                    // Normal closing '
                    inSingleStr = false;
                    result.push(ch);
                    i++;
                    continue;
                }

                // Opening '
                inSingleStr = true;
                result.push(ch);
                i++;
                continue;
            }

            result.push(ch);
            i++;
        }

        return result.join('');
    });

    return { content: fixedLines.join('\n'), fixCount };
}

// Main
const srcDir = path.join(__dirname, 'src');
const files = findJsxFiles(srcDir);
let totalFixes = 0;
let totalFiles = 0;

console.log('Processing ' + files.length + ' JSX files...\n');

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { content: fixed, fixCount } = fixFile(content);

    if (fixed !== content) {
        fs.writeFileSync(file, fixed, 'utf-8');
        const relPath = path.relative(__dirname, file);
        console.log('FIXED: ' + relPath + ' (' + fixCount + ' corrections)');
        totalFiles++;
        totalFixes += fixCount;
    }
}

console.log('\nTotal: ' + totalFixes + ' fixes across ' + totalFiles + ' files');
