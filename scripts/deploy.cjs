/**
 * Cafe24 SFTP 배포 스크립트
 * ssh2-sftp-client를 사용하여 dist/ 내용을 /www/ 로 전송
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

async function uploadDirContents(sftp, localDir, remoteDir) {
    const items = fs.readdirSync(localDir);
    let uploadCount = 0;

    for (const item of items) {
        const localPath = path.join(localDir, item);
        const remotePath = `${remoteDir}/${item}`;
        const stat = fs.statSync(localPath);

        if (stat.isDirectory()) {
            // 디렉토리면 원격에 생성 (이미 존재하면 무시)
            try {
                await sftp.mkdir(remotePath, true);
            } catch (e) {
                // 이미 존재하는 경우 무시
            }
            // 재귀적으로 내부 파일 업로드
            const subCount = await uploadDirContents(sftp, localPath, remotePath);
            uploadCount += subCount;
        } else {
            // 파일이면 업로드
            await sftp.put(localPath, remotePath);
            uploadCount++;
        }
    }

    return uploadCount;
}

async function deploy() {
    const sftp = new SftpClient();

    console.log(`🚀 Connecting to ${config.host}:${config.port}...`);
    await sftp.connect(config);
    console.log('✅ Connected!');

    console.log(`📂 Uploading contents of ${LOCAL_DIR} → ${REMOTE_DIR}`);
    const count = await uploadDirContents(sftp, LOCAL_DIR, REMOTE_DIR);
    console.log(`✅ ${count} files uploaded!`);

    await sftp.end();
    console.log('🎉 Deploy finished!');
}

deploy().catch((err) => {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
});
