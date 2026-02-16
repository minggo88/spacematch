/**
 * SpaceMatch Delta Upload Detector
 * 
 * 빌드 후 변경된 파일만 감지하여 upload/ 폴더에 복사합니다.
 * 
 * 동작 방식:
 *   1) dist/ 폴더의 모든 파일 해시(MD5)를 계산
 *   2) 이전 빌드의 해시 스냅샷(.build_snapshot.json)과 비교
 *   3) 새로 추가되거나 변경된 파일만 upload/ 폴더에 복사
 *   4) 현재 해시를 새 스냅샷으로 저장
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIST_DIR = path.join(__dirname, 'dist');
const UPLOAD_DIR = path.join(__dirname, 'upload');
const SNAPSHOT_FILE = path.join(__dirname, '.build_snapshot.json');
const LOG_FILE = path.join(__dirname, 'upload_log.txt');

// ── 파일 해시 계산 ──
function getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
}

// ── 디렉토리 내 모든 파일 재귀 탐색 ──
function getAllFiles(dirPath, basePath = dirPath) {
    const files = [];
    if (!fs.existsSync(dirPath)) return files;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...getAllFiles(fullPath, basePath));
        } else {
            const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');
            files.push({ fullPath, relativePath });
        }
    }
    return files;
}

// ── 디렉토리 생성 (재귀) ──
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// ── 파일 복사 ──
function copyFile(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

// ── 메인 로직 ──
function main() {
    console.log('  [Delta] Scanning dist/ for file changes...');

    // 1) 이전 스냅샷 로드
    let prevSnapshot = {};
    if (fs.existsSync(SNAPSHOT_FILE)) {
        try {
            prevSnapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'));
            console.log(`  [Delta] Previous snapshot loaded (${Object.keys(prevSnapshot).length} files)`);
        } catch (e) {
            console.log('  [Delta] Previous snapshot corrupt, treating as first build');
            prevSnapshot = {};
        }
    } else {
        console.log('  [Delta] No previous snapshot found (first build)');
    }

    // 2) 현재 dist/ 파일 해시 계산
    const distFiles = getAllFiles(DIST_DIR);
    const currentSnapshot = {};
    for (const file of distFiles) {
        currentSnapshot[file.relativePath] = getFileHash(file.fullPath);
    }
    console.log(`  [Delta] Current build: ${distFiles.length} files scanned`);

    // 3) 변경 감지
    const changedFiles = [];
    const newFiles = [];
    const unchangedFiles = [];
    const deletedFiles = [];

    for (const [relPath, hash] of Object.entries(currentSnapshot)) {
        if (!prevSnapshot[relPath]) {
            newFiles.push(relPath);
        } else if (prevSnapshot[relPath] !== hash) {
            changedFiles.push(relPath);
        } else {
            unchangedFiles.push(relPath);
        }
    }

    for (const relPath of Object.keys(prevSnapshot)) {
        if (!currentSnapshot[relPath]) {
            deletedFiles.push(relPath);
        }
    }

    const filesToUpload = [...newFiles, ...changedFiles];

    // 4) 결과 출력
    console.log('');
    console.log('  ┌─────────────────────────────────────┐');
    console.log(`  │  New files:       ${String(newFiles.length).padStart(5)}              │`);
    console.log(`  │  Changed files:   ${String(changedFiles.length).padStart(5)}              │`);
    console.log(`  │  Unchanged files: ${String(unchangedFiles.length).padStart(5)}              │`);
    console.log(`  │  Deleted files:   ${String(deletedFiles.length).padStart(5)}              │`);
    console.log('  │─────────────────────────────────────│');
    console.log(`  │  Files to upload: ${String(filesToUpload.length).padStart(5)}              │`);
    console.log('  └─────────────────────────────────────┘');

    // 5) upload/ 폴더 생성 및 변경 파일 복사
    if (fs.existsSync(UPLOAD_DIR)) {
        fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
    }

    if (filesToUpload.length === 0) {
        console.log('');
        console.log('  [Delta] No changes detected via hash comparison.');
        console.log('  [Delta] Safety net: copying ALL dist files to upload/ to prevent empty uploads.');
        ensureDir(UPLOAD_DIR);
        // Copy all dist files as a safety measure
        for (const file of distFiles) {
            const dest = path.join(UPLOAD_DIR, file.relativePath);
            copyFile(file.fullPath, dest);
        }
        console.log(`  [Delta] ${distFiles.length} files copied to upload/ (full copy)`);
    } else {
        ensureDir(UPLOAD_DIR);
        for (const relPath of filesToUpload) {
            const src = path.join(DIST_DIR, relPath);
            const dest = path.join(UPLOAD_DIR, relPath);
            copyFile(src, dest);
        }
        console.log(`  [Delta] ${filesToUpload.length} changed files copied to upload/`);
    }

    // 6) 로그 파일 생성
    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const logLines = [
        `SpaceMatch Delta Upload Log`,
        `Build Time: ${timestamp}`,
        ``,
        `=== Summary ===`,
        `New:       ${newFiles.length}`,
        `Changed:   ${changedFiles.length}`,
        `Unchanged: ${unchangedFiles.length}`,
        `Deleted:   ${deletedFiles.length}`,
        `Total to upload: ${filesToUpload.length}`,
        ``
    ];

    if (newFiles.length > 0) {
        logLines.push('=== New Files ===');
        newFiles.forEach(f => logLines.push(`  + ${f}`));
        logLines.push('');
    }
    if (changedFiles.length > 0) {
        logLines.push('=== Changed Files ===');
        changedFiles.forEach(f => logLines.push(`  ~ ${f}`));
        logLines.push('');
    }
    if (deletedFiles.length > 0) {
        logLines.push('=== Deleted from Server (manual removal needed) ===');
        deletedFiles.forEach(f => logLines.push(`  - ${f}`));
        logLines.push('');
    }
    if (unchangedFiles.length > 0) {
        logLines.push('=== Unchanged Files (skipped) ===');
        unchangedFiles.forEach(f => logLines.push(`    ${f}`));
        logLines.push('');
    }

    fs.writeFileSync(LOG_FILE, logLines.join('\n'), 'utf-8');
    console.log(`  [Delta] Upload log saved to upload_log.txt`);

    // 7) 현재 스냅샷 저장
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(currentSnapshot, null, 2), 'utf-8');
    console.log('  [Delta] Snapshot updated for next build comparison');
}

main();
