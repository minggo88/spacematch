// Final batch fixer for remaining corruption patterns
// Pattern 1: Unterminated template literals like `${expr}Korean ??;
// Pattern 2: Mid-string apostrophe: 'Korean text' more Korean'
// Pattern 3: Double-quote attribute corruption: placeholder="Korean" "more Korean.."
// Pattern 4: Stray apostrophe after Korean in JSX text content

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all JSX files
const files = glob.sync('src/**/*.jsx', { cwd: __dirname });

let totalFixes = 0;

files.forEach(relFile => {
    const filePath = path.join(__dirname, relFile);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let fixes = 0;

    // Pattern 1: Fix unterminated template literals
    // Matches: `${expr}CORRUPTED_KOREAN;  (missing closing backtick)
    // The pattern is a backtick-started template that ends with ; instead of `;
    content = content.replace(/`(\$\{[^}]+\}[^`\n;]*);/g, (match, inner) => {
        // Check if this looks like it should end with a backtick
        // Only fix if there's no closing backtick before the semicolon
        if (!match.includes('`', 1)) {
            fixes++;
            return '`' + inner + '`;';
        }
        return match;
    });

    // Pattern 2: Fix double-quote attribute corruption
    // placeholder="Korean" "more Korean.."
    // Should be: placeholder="Korean more Korean.."
    content = content.replace(/(placeholder|title|alt|aria-label)="([^"]*)" "([^"]*)"/g, (match, attr, p1, p2) => {
        fixes++;
        return `${attr}="${p1} ${p2}"`;
    });

    // Pattern 3: Fix mid-string apostrophe in single-quoted Korean strings
    // 'Korean text' more text' -> 'Korean text more text'
    // This is tricky - look for patterns where a single quote appears between Korean chars
    // Specifically: '..Korean..' Korean..' pattern  
    // We look for: showToast('Korean' 'Korean', ... pattern
    content = content.replace(/(showToast\('[^']*)'(\s*)'([^']*',)/g, (match, p1, space, p2) => {
        fixes++;
        return `${p1}${space}${p2}`;
    });

    // Also fix: 'Korean text' Korean text' pattern (mid-string break)
    // Match: 'text' text'  where both sides have Korean-looking chars
    // Use a simpler approach - fix known patterns

    // Pattern: 영구' 차단  -> should be within quotes
    // Pattern: 활동' (일시 차단) -> should be within quotes
    // Pattern: 차단 해제 (정상' -> should be within quotes  
    // These are button labels inside JSX

    if (fixes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${fixes} issues in ${relFile}`);
        totalFixes += fixes;
    }
});

console.log(`\nTotal fixes: ${totalFixes}`);
