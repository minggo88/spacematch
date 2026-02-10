const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findJsxFiles(dir) {
    const results = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && !['node_modules', 'dist', '.git'].includes(item.name)) {
            results.push(...findJsxFiles(fullPath));
        } else if (item.name.endsWith('.jsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

const srcDir = path.join(__dirname, 'src');
const esbuildBin = path.join(__dirname, 'node_modules', '.bin', 'esbuild.cmd');
const files = findJsxFiles(srcDir);

const errors = [];

for (const file of files) {
    try {
        execSync(`"${esbuildBin}" --bundle=false --loader=jsx "${file}" --outfile=nul 2>&1`, {
            cwd: __dirname,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
    } catch (e) {
        const stderr = e.stderr || e.stdout || e.message;
        const relPath = path.relative(__dirname, file);
        // Extract just the error line info
        const errorMatch = stderr.match(/ERROR: (.+)/);
        const lineMatch = stderr.match(/:(\d+):\d+:/);
        const errorMsg = errorMatch ? errorMatch[1] : 'Unknown error';
        const lineNum = lineMatch ? lineMatch[1] : '?';
        errors.push({ file: relPath, line: lineNum, error: errorMsg });
    }
}

console.log('=== FILES WITH ERRORS ===');
console.log('Total: ' + errors.length + ' / ' + files.length + ' files\n');
errors.forEach(e => {
    console.log(e.file + ':' + e.line + ' -> ' + e.error);
});
