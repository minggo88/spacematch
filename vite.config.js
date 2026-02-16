import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: '/',
    build: {
        // ── Security: 프로덕션 빌드 보안 설정 ──
        minify: mode === 'production' ? 'terser' : false,
        chunkSizeWarningLimit: 2000,
        sourcemap: false, // Source map 비활성화 (코드 노출 방지)
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
