/**
 * VenueDetailModal.jsx div 깊이 분석 및 수정
 */
const fs = require('fs');
const fp = 'c:/Users/KYUNG005/Desktop/spacematch/src/components/VenueDetailModal.jsx';
let c = fs.readFileSync(fp, 'utf8');
const le = c.includes('\r\n') ? '\r\n' : '\n';
let lines = c.split(/\r?\n/);

// Find the return statement
let returnLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('return (')) { returnLine = i; break; }
}
console.log('Return at line', returnLine + 1);

// Count all opening and closing tags from return to end
let depth = 0;
for (let i = returnLine; i < lines.length; i++) {
    const line = lines[i];
    // Match opening tags that are not self-closing
    const openMatches = line.match(/<([a-zA-Z][a-zA-Z0-9]*)\b[^/>]*(?<!\/)>/g) || [];
    // Match self-closing
    const selfClose = line.match(/<[a-zA-Z][^>]*\/>/g) || [];
    // Match closing tags
    const closeMatches = line.match(/<\/[a-zA-Z][a-zA-Z0-9]*\s*>/g) || [];
    // Fragment opening/closing
    const fragOpen = (line.match(/<>/g) || []).length;
    const fragClose = (line.match(/<\/>/g) || []).length;

    const change = openMatches.length + fragOpen - closeMatches.length - fragClose;
    depth += change;

    if (change !== 0 || depth <= 3) {
        console.log(`L${i + 1} d=${depth} (${change >= 0 ? '+' : ''}${change}): ${line.trim().substring(0, 80)}`);
    }
}
console.log('\nFinal depth:', depth, '(should be 0)');

if (depth > 0) {
    // Need to add closing tags before );
    let insertPoint = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === ');') { insertPoint = i; break; }
    }
    if (insertPoint >= 0) {
        for (let j = 0; j < depth; j++) {
            lines.splice(insertPoint, 0, '        </div>');
        }
        console.log(`✅ ${depth}개 </div> 추가 at L${insertPoint + 1}`);
        c = lines.join(le);
        fs.writeFileSync(fp, c, 'utf8');
    }
}
