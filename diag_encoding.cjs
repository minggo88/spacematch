const fs = require('fs');
const iconv = require('iconv-lite');

const content = fs.readFileSync('src/pages/LandingPage.jsx');

// Find Korean text area - search for the closing </span> after "font-medium"
const searchStr = Buffer.from('font-medium">', 'utf-8');
let idx = content.indexOf(searchStr);
// Skip to the second occurrence (line 107)
idx = content.indexOf(searchStr, idx + 1);

if (idx !== -1) {
    const slice = content.slice(idx, idx + 100);
    console.log('=== Bytes around Korean text (line ~107) ===');
    console.log('Hex:', slice.toString('hex').match(/.{1,2}/g).join(' '));
    console.log('UTF-8:', slice.toString('utf-8'));
    console.log('');

    // Identify the byte patterns of the garbled Korean characters
    // If bytes are: EF BF BD pattern = UTF-8 replacement character (data lost)
    // If bytes are valid multi-byte sequences = encoding mismatch (recoverable)

    // Check for replacement character pattern
    const hexStr = slice.toString('hex');
    if (hexStr.includes('efbfbd')) {
        console.log('⚠️  Found U+FFFD replacement characters - DATA MAY BE LOST');
        console.log('The encoding damage may be irreversible.');
    } else {
        console.log('✓ No replacement characters found - recovery may be possible');
    }

    // Try various encodings
    const encodings = ['euc-kr', 'cp949', 'shift_jis', 'utf-16le', 'utf-16be'];
    for (const enc of encodings) {
        try {
            const decoded = iconv.decode(slice, enc);
            console.log(`As ${enc}: ${decoded.substring(0, 60)}`);
        } catch (e) {
            console.log(`As ${enc}: ERROR - ${e.message}`);
        }
    }
}

// Also check a more identifiable Korean string - look for "공간" in the file
const gongganUtf8 = Buffer.from('공간', 'utf-8'); // EA B3 B5 EA B0 84
const gongganIdx = content.indexOf(gongganUtf8);
console.log('\n=== Search for "공간" (UTF-8 bytes EA B3 B5 EA B0 84) ===');
console.log('Found at index:', gongganIdx);

if (gongganIdx === -1) {
    // Try to find the garbled version
    // Let's search for common garbled patterns
    console.log('Not found in UTF-8. Scanning for non-ASCII byte ranges...');

    // Find first non-ASCII byte
    for (let i = 0; i < content.length; i++) {
        if (content[i] > 0x7f) {
            const sample = content.slice(i, i + 30);
            console.log(`First non-ASCII at byte ${i}:`);
            console.log('Hex:', sample.toString('hex').match(/.{1,2}/g).join(' '));
            console.log('UTF-8:', sample.toString('utf-8'));

            // Try double-decoding: maybe it was UTF-8 -> EUC-KR -> UTF-8 -> EUC-KR
            try {
                const step1 = iconv.decode(sample, 'utf-8');
                console.log('Read as UTF-8:', step1);
                const step2 = iconv.encode(step1, 'euc-kr');
                console.log('Then encode EUC-KR, hex:', step2.toString('hex').match(/.{1,2}/g).join(' '));
                const step3 = step2.toString('utf-8');
                console.log('Then read as UTF-8:', step3);
            } catch (e) { }

            break;
        }
    }
}
