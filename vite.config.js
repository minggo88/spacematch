import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: '/',
    build: {
        // ── Security: 프로덕션 빌드 보안 설정 ──
        minify: mode === 'production' ? 'terser' : false,
        chunkSizeWarningLimit: 2500,
        sourcemap: false, // Source map 비활성화 (코드 노출 방지)
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-xlsx': ['xlsx'],
                    'vendor-icons': ['lucide-react'],
                    'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
                }
            }
        },
        terserOptions: mode === 'production' ? {
            compress: {
                drop_console: true,    // console.log 등 제거
                drop_debugger: true,   // debugger 문 제거
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
            },
            format: {
                comments: false        // 주석 제거
            }
        } : {}
    }
}))
