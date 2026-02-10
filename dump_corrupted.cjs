const fs = require('fs');
const path = require('path');
const src = 'c:/Users/KYUNG005/Desktop/spacematch/src';

function scan(dir) {
    const files = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) files.push(...scan(p));
        else if (f.name.endsWith('.jsx') || f.name.endsWith('.js')) files.push(p);
    }
    return files;
}

const files = scan(src);
for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    const relPath = path.relative(src, f).replace(/\\/g, '/');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('\uFFFD')) {
            console.log(`${relPath}:${i + 1}: ${lines[i].trimEnd()}`);
        }
    }
}
