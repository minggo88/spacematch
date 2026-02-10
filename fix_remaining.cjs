/**
 * Fix all 11 remaining build-breaking issues found by diagnostic.
 * Each fix is targeted at a specific line and pattern.
 */
const fs = require('fs');
const path = require('path');

function fixFile(relPath, fixes) {
    const filePath = path.join(__dirname, relPath);
    if (!fs.existsSync(filePath)) { console.log(`SKIP: ${relPath}`); return; }

    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    let fixCount = 0;

    fixes.forEach(fix => {
        const idx = fix.line - 1;
        if (idx >= 0 && idx < lines.length) {
            const before = lines[idx];
            if (fix.find && fix.replace !== undefined) {
                if (before.includes(fix.find)) {
                    lines[idx] = before.replace(fix.find, fix.replace);
                    fixCount++;
                    console.log(`  L${fix.line}: Fixed "${fix.desc || fix.find}"`);
                } else {
                    console.log(`  L${fix.line}: WARN - pattern not found: "${fix.find.substring(0, 50)}"`);
                }
            } else if (fix.replaceLine) {
                lines[idx] = fix.replaceLine;
                fixCount++;
                console.log(`  L${fix.line}: Replaced entire line - ${fix.desc}`);
            }
        }
    });

    if (fixCount > 0) {
        fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
        console.log(`SAVED ${relPath} (${fixCount} fixes)\n`);
    }
}

// AdminVenues.jsx fixes
fixFile('src/pages/admin/AdminVenues.jsx', [
    {
        line: 229, desc: 'unclosed attribute',
        find: 'title="\uBCA0\uB274 ??????>',
        replace: 'title="\uBCA0\uB274 \uC720\uD615 \uC124\uC815">'
    },
    {
        line: 354, desc: 'odd single quote in option',
        find: "'\uAC00 ?", replace: "'\uAC00\uACA9 \uB192\uC740\uC21C'"
    },
]);

// AdminAds.jsx fixes
fixFile('src/pages/admin/AdminAds.jsx', [
    {
        line: 362, desc: 'stray quote in button text',
        find: "?\uC815 ' </button>", replace: "\uC800\uC7A5</button>"
    },
]);

// VendorVenues.jsx fixes
fixFile('src/pages/vendor/VendorVenues.jsx', [
    {
        line: 115, desc: 'stray empty string at start',
        find: "showToast('' ?\uC624\uB958? \uBC1C\uC0DD?\uC2B5?\uB2E4.'",
        replace: "showToast('\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.'"
    },
]);

// SellerProfile.jsx fixes
fixFile('src/pages/seller/SellerProfile.jsx', [
    {
        line: 111, desc: 'stray quote in alert',
        find: "alert('?\uB85C????' ?\uACBD\uB418?\uC2B5?\uB2E4.')",
        replace: "alert('\\uD504\\uB85C\\uD544 \\uC0AC\\uC9C4\\uC774 \\uBCC0\\uACBD\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.')"
    },
    {
        line: 132, desc: 'stray quotes in alert',
        find: "alert('\uCD5C' 5'\uAE4C' ?\uB85C????\uD569?\uB2E4.')",
        replace: "alert('\\uCD5C\\uB300 5\\uC7A5\\uAE4C\\uC9C0 \\uC5C5\\uB85C\\uB4DC \\uAC00\\uB2A5\\uD569\\uB2C8\\uB2E4.')"
    },
    {
        line: 178, desc: 'stray empty string in alert',
        find: "alert('' ?\uC624\uB958? \uBC1C\uC0DD?\uC2B5?\uB2E4.')",
        replace: "alert('\\uC624\\uB958\\uAC00 \\uBC1C\\uC0DD\\uD588\\uC2B5\\uB2C8\\uB2E4.')"
    },
    {
        line: 208, desc: 'stray quote in alert',
        find: "alert('\uBE44?\uBC88\uD638 \uCE58?' ?\uC2B5?\uB2E4.')",
        replace: "alert('\\uBE44\\uBC00\\uBC88\\uD638\\uAC00 \\uC77C\\uCE58\\uD558\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4.')"
    },
    {
        line: 213, desc: 'stray quote in alert',
        find: "alert('\uBE44?\uBC88\uD638' ?\uACBD\uB418?\uC2B5?\uB2E4.')",
        replace: "alert('\\uBE44\\uBC00\\uBC88\\uD638\\uAC00 \\uBCC0\\uACBD\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.')"
    },
]);

// SellerApplications.jsx fixes
fixFile('src/pages/seller/SellerApplications.jsx', [
    {
        line: 201, desc: 'stray quote after price',
        find: "} /' </div>", replace: "} /\\uC77C</div>"
    },
    {
        line: 299, desc: 'stray quote in text',
        find: "?\uC778???\uCCAD' \uC9C1\uC811 \uCDE8\uC18C?????\uC2B5?\uB2E4.",
        replace: "\\uC2B9\\uC778\\uB41C \\uC2E0\\uCCAD\\uC740 \\uC9C1\\uC811 \\uCDE8\\uC18C\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4."
    },
]);

console.log('Done!');
