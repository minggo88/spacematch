/**
 * Cafe24 SFTP 배포 스크립트
 * ssh2-sftp-client를 사용하여 dist/ 내용을 서버로 전송
 */
const SftpClient = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const config = {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT || '22'),
    username: process.env.SFTP_USERNAME,
    privateKey: process.env.SSH_PRIVATE_KEY,
};

const LOCAL_DIR = path.resolve(__dirname, '../dist');
const REMOTE_DIR = '/www';

async function uploadDirContents(sftp, localDir, remoteDir, depth = 0) {
    const items = fs.readdirSync(localDir);
    let uploadCount = 0;
    const indent = '  '.repeat(depth);

    for (const item of items) {
        const localPath = path.join(localDir, item);
        const remotePath = `${remoteDir}/${item}`;
        const stat = fs.statSync(localPath);

        if (stat.isDirectory()) {
            console.log(`${indent}📁 ${item}/`);
            try {
                const exists = await sftp.exists(remotePath);
                if (!exists) {
                    await sftp.mkdir(remotePath, true);
                }
            } catch (e) {
                console.log(`${indent}  ⚠️ mkdir ${remotePath}: ${e.message} (continuing...)`);
            }
            const subCount = await uploadDirContents(sftp, localPath, remotePath, depth + 1);
            uploadCount += subCount;
        } else {
            try {
                await sftp.put(localPath, remotePath);
                uploadCount++;
                if (depth === 0) console.log(`${indent}📄 ${item} ✓`);
            } catch (e) {
                console.log(`${indent}❌ ${item}: ${e.message}`);
                throw e;
            }
        }
    }

    return uploadCount;
}

async function deploy() {
    const sftp = new SftpClient();

    console.log(`🚀 Connecting to ${config.host}:${config.port}...`);
    await sftp.connect(config);
    console.log('✅ Connected!');

    // 디버그: 원격 디렉토리 확인
    console.log('\n📋 Checking remote directory...');
    try {
        const cwd = await sftp.cwd();
        console.log(`  Current dir: ${cwd}`);
    } catch (e) { /* ignore */ }

    try {
        const wwwExists = await sftp.exists(REMOTE_DIR);
        console.log(`  /www exists: ${wwwExists}`);
        if (wwwExists) {
            const list = await sftp.list(REMOTE_DIR);
            console.log(`  /www contents (${list.length} items): ${list.slice(0, 10).map(f => f.name).join(', ')}${list.length > 10 ? '...' : ''}`);
        }
    } catch (e) {
        console.log(`  /www check error: ${e.message}`);
    }

    // 홈 디렉토리 확인
    try {
        const homeList = await sftp.list('.');
        console.log(`  Home dir contents: ${homeList.slice(0, 10).map(f => f.name).join(', ')}`);
    } catch (e) { /* ignore */ }

    console.log(`\n📂 Uploading to ${REMOTE_DIR}...`);
    const count = await uploadDirContents(sftp, LOCAL_DIR, REMOTE_DIR);
    console.log(`\n✅ ${count} files uploaded!`);

    await sftp.end();
    console.log('🎉 Deploy finished!');
}

deploy().catch((err) => {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
});
