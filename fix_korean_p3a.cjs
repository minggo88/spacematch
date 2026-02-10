/**
 * Phase 3: Line-level replacement for remaining corrupted files
 * This reads each file, identifies corrupted lines by line number, and replaces them entirely
 */
const fs = require('fs');
const path = require('path');
const BASE = 'c:/Users/KYUNG005/Desktop/spacematch/src';

// Format: [relFile, lineNumber (1-indexed), entireCorrectLine]
// We replace the ENTIRE line content at that line number
const lineReplacements = {
    // ============================================================
    // VenueModal.jsx - remaining corrupted lines
    // ============================================================
    'components/VenueModal.jsx': {
        // Venue type labels
        55: "    const typeLabels = { popup: '팝업스토어', gallery: '갤러리', cafe: '카페', showroom: '쇼룸', fleamarket: '플리마켓', store: '매장' };",
        // size labels
        56: "    const sizeLabels = { small: '소형 (10평 미만)', medium: '중형 (10~30평)', large: '대형 (30평 이상)' };",
    },

    // ============================================================
    // VenueDetailModal.jsx - remaining corrupted lines
    // ============================================================
    'components/VenueDetailModal.jsx': {
        51: "    const typeLabels = { popup: '팝업스토어', gallery: '갤러리', cafe: '카페', showroom: '쇼룸', fleamarket: '플리마켓', store: '매장' };",
    },
};

// Process each file
let totalFixed = 0;
for (const [relFile, lineMap] of Object.entries(lineReplacements)) {
    const filePath = path.join(BASE, relFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
    let fileFixed = 0;

    for (const [lineNumStr, correctLine] of Object.entries(lineMap)) {
        const lineIdx = parseInt(lineNumStr) - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
            if (lines[lineIdx] !== correctLine && lines[lineIdx].includes('\uFFFD')) {
                lines[lineIdx] = correctLine;
                fileFixed++;
            }
        }
    }

    if (fileFixed > 0) {
        fs.writeFileSync(filePath, lines.join(lineEnding), 'utf8');
        console.log(`✅ ${relFile}: ${fileFixed} lines fixed`);
        totalFixed += fileFixed;
    }
}
console.log(`\nPhase 3a total: ${totalFixed} line fixes applied`);
