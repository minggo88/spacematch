import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.spacematch.app',
    appName: 'SpaceMatch',
    webDir: 'dist',

    // ─── Server Settings ───
    server: {
        // 프로덕션 서버 URL (배포 시 실제 도메인으로 변경)
        // url: 'https://your-domain.com',

        // 허용된 네비게이션 도메인 (보안)
        allowNavigation: [
            'spacematch.co.kr',
            '*.spacematch.co.kr'
        ],

        // 외부 콘텐츠 로딩 차단
        errorPath: 'error.html'
    },

    // ─── Android Security ───
    android: {
        allowMixedContent: false,      // HTTP 콘텐츠 차단 (HTTPS만 허용)
        captureInput: true,
        webContentsDebuggingEnabled: false  // 프로덕션에서 WebView 디버깅 차단
    },

    // ─── iOS Security ───
    ios: {
        contentInset: 'automatic',
        allowsLinkPreview: false,      // 링크 미리보기 차단 (정보 유출 방지)
        scrollEnabled: true
    },

    // ─── Plugins ───
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#1E1B4B',
            androidSplashResourceName: 'splash',
            showSpinner: false
        }
    }
};

export default config;
