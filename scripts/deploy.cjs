/**
 * Cafe24 SFTP 배포 스크립트
 * ssh2-sftp-client를 사용하여 dist/ → /www/ 로 파일 전송
 */
const SftpClient = require('ssh2-sftp-client');
const path = require('path');

const config = {
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT || '22'),
    username: process.env.SFTP_USERNAME,
    privateKey: process.env.SSH_PRIVATE_KEY,
};

const LOCAL_DIR = path.resolve(__dirname, '../dist');
const REMOTE_DIR = '/www';

async function deploy() {
    const sftp = new SftpClient();

    console.log(`🚀 Connecting to ${config.host}:${config.port}...`);
    await sftp.connect(config);
    console.log('✅ Connected!');

    console.log(`📂 Uploading ${LOCAL_DIR} → ${REMOTE_DIR}`);
    await sftp.uploadDir(LOCAL_DIR, REMOTE_DIR);
    console.log('✅ Upload complete!');

    await sftp.end();
    console.log('🎉 Deploy finished!');
}

deploy().catch((err) => {
    console.error('❌ Deploy failed:', err.message);
    process.exit(1);
});
