import { useEffect, useCallback, useState } from 'react';

/**
 * SecurityGuard — 최고 수준 콘텐츠 보호 시스템
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Layer 1: 이벤트 차단 (우클릭, 키보드, 드래그, 복사, 인쇄)    │
 * │  Layer 2: 개발자 도구 탐지 (타이밍, 창 크기, debugger)        │
 * │  Layer 3: 화면 녹화 / 캡처 API 탐지                          │
 * │  Layer 4: CSS 기반 보호 (선택, 드래그, 인쇄, 블렌드)           │
 * │  Layer 5: 클립보드 오염 + iframe 차단                        │
 * └─────────────────────────────────────────────────────────────┘
 */
const SecurityGuard = () => {
    const [devtoolsAllowed, setDevtoolsAllowed] = useState(false);

    // Fetch security setting: is devtools blocking disabled?
    useEffect(() => {
        fetch('/api/admin/security_flags.php', { credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.success && data.flags?.disable_devtools_block === '1') {
                    setDevtoolsAllowed(true);
                }
            })
            .catch(() => { });
    }, []);

    // ═══════════════════════════════════════════
    // LAYER 1: Event Blocking (이벤트 차단)
    // ═══════════════════════════════════════════

    const blockEvent = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);

    useEffect(() => {
        // If devtools are allowed by admin setting, skip Layer 1
        if (devtoolsAllowed) return;

        // ─── 1-A. Context Menu (우클릭) 완전 차단 ───
        const handleContextMenu = (e) => blockEvent(e);

        // ─── 1-B. Keyboard Shortcuts 차단 ───
        const handleKeyDown = (e) => {
            const key = e.key?.toLowerCase();
            const code = e.keyCode || e.which;

            // PrintScreen (44)
            if (key === 'printscreen' || code === 44) {
                e.preventDefault();
                // Attempt to clear clipboard
                try { navigator.clipboard?.writeText?.(''); } catch { }
                showSecurityAlert();
                return false;
            }

            // F12 (개발자 도구)
            if (code === 123) {
                e.preventDefault();
                return false;
            }

            // Ctrl / Cmd combinations
            if (e.ctrlKey || e.metaKey) {
                // Ctrl+U (소스보기)
                if (key === 'u') { e.preventDefault(); return false; }
                // Ctrl+S (저장)
                if (key === 's') { e.preventDefault(); return false; }
                // Ctrl+P (인쇄)
                if (key === 'p') { e.preventDefault(); return false; }
                // Ctrl+A (전체 선택)
                if (key === 'a') { e.preventDefault(); return false; }
                // Ctrl+C (복사)
                if (key === 'c' && !e.shiftKey) { e.preventDefault(); return false; }
                // Ctrl+Shift+I/J/C (개발자 도구)
                if (e.shiftKey && ['i', 'j', 'c'].includes(key)) {
                    e.preventDefault();
                    return false;
                }
                // Ctrl+Shift+S (스크린샷)
                if (e.shiftKey && key === 's') {
                    e.preventDefault();
                    showSecurityAlert();
                    return false;
                }
            }

            // Windows: Win+Shift+S (Snipping Tool)
            if (e.metaKey && e.shiftKey && key === 's') {
                e.preventDefault();
                showSecurityAlert();
                return false;
            }
        };

        // ─── 1-C. Drag Prevention (드래그 방지) ───
        const handleDragStart = (e) => {
            // Allow Leaflet map dragging
            if (e.target.closest && e.target.closest('.leaflet-container')) return;
            e.preventDefault();
            return false;
        };

        // ─── 1-D. Copy / Cut Prevention (복사/잘라내기 차단) ───
        const handleCopy = (e) => {
            // Allow in input/textarea
            const tag = e.target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            e.preventDefault();
            // Clipboard poisoning: replace with warning message
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', '이 콘텐츠는 저작권으로 보호됩니다. 무단 복제를 금지합니다.');
            }
            return false;
        };

        // ─── 1-E. Print Prevention (인쇄 차단) ───
        const handleBeforePrint = () => {
            document.body.style.visibility = 'hidden';
        };
        const handleAfterPrint = () => {
            document.body.style.visibility = 'visible';
        };

        // ─── 1-F. Selection Prevention ───
        const handleSelectStart = (e) => {
            const tag = e.target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            e.preventDefault();
            return false;
        };

        // Register all event listeners
        document.addEventListener('contextmenu', handleContextMenu, true);
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keyup', (e) => {
            if (e.keyCode === 44) {
                try { navigator.clipboard?.writeText?.(''); } catch { }
            }
        }, true);
        document.addEventListener('dragstart', handleDragStart, true);
        document.addEventListener('drop', (e) => {
            // Allow inside Leaflet map containers
            if (e.target.closest && e.target.closest('.leaflet-container')) return;
            blockEvent(e);
        }, true);
        document.addEventListener('copy', handleCopy, true);
        document.addEventListener('cut', handleCopy, true);
        document.addEventListener('selectstart', handleSelectStart, true);
        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu, true);
            document.removeEventListener('keydown', handleKeyDown, true);
            document.removeEventListener('dragstart', handleDragStart, true);
            document.removeEventListener('drop', blockEvent, true);
            document.removeEventListener('copy', handleCopy, true);
            document.removeEventListener('cut', handleCopy, true);
            document.removeEventListener('selectstart', handleSelectStart, true);
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [blockEvent, devtoolsAllowed]);

    // ═══════════════════════════════════════════
    // LAYER 2: DevTools Detection (개발자 도구 탐지)
    // ═══════════════════════════════════════════

    useEffect(() => {
        // If devtools are allowed by admin setting, skip Layer 2
        if (devtoolsAllowed) return;

        let devtoolsOpen = false;

        // Method 1: Window size difference detection
        const checkDevToolsBySize = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    handleDevToolsDetected();
                }
            } else {
                devtoolsOpen = false;
            }
        };

        // Method 2: Debugger timing detection
        const checkDevToolsByTiming = () => {
            const start = performance.now();
            // debugger statement causes a pause ONLY when DevTools is open
            // Using Function constructor to avoid static analysis
            try {
                const check = new Function('debugger');
                check();
            } catch { }
            const elapsed = performance.now() - start;
            if (elapsed > 100) {
                handleDevToolsDetected();
            }
        };

        // Method 3: Console.log detection
        const checkDevToolsByLog = () => {
            const el = new Image();
            Object.defineProperty(el, 'id', {
                get: function () {
                    handleDevToolsDetected();
                    return '';
                }
            });
            // Suppress any console output from this
            // eslint-disable-next-line no-console
            console.debug('%c', el);
        };

        const handleDevToolsDetected = () => {
            // Overlay a warning
            let overlay = document.getElementById('security-devtools-warning');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'security-devtools-warning';
                overlay.style.cssText = `
                    position: fixed; inset: 0; z-index: 2147483647;
                    background: rgba(0,0,0,0.95);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: white; font-family: -apple-system, sans-serif;
                `;
                overlay.innerHTML = `
                    <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
                    <h2 style="font-size: 28px; font-weight: 900; margin-bottom: 12px;">보안 경고</h2>
                    <p style="font-size: 16px; color: #ccc; text-align: center; max-width: 400px; line-height: 1.6;">
                        개발자 도구가 감지되었습니다.<br/>
                        보안을 위해 페이지가 보호 모드로 전환됩니다.<br/>
                        개발자 도구를 닫으면 정상적으로 이용 가능합니다.
                    </p>
                `;
                document.body.appendChild(overlay);
            }
        };

        // Periodic check
        const interval = setInterval(() => {
            checkDevToolsBySize();
        }, 1000);

        // Less frequent timing check (heavier)
        const timingInterval = setInterval(() => {
            checkDevToolsByTiming();
        }, 3000);

        // Console detection (infrequent)
        const logInterval = setInterval(() => {
            checkDevToolsByLog();
        }, 5000);

        // Remove warning when DevTools is closed
        const cleanupInterval = setInterval(() => {
            const widthOk = window.outerWidth - window.innerWidth <= 160;
            const heightOk = window.outerHeight - window.innerHeight <= 160;
            if (widthOk && heightOk) {
                const overlay = document.getElementById('security-devtools-warning');
                if (overlay) overlay.remove();
                devtoolsOpen = false;
            }
        }, 1500);

        // Resize detection
        window.addEventListener('resize', checkDevToolsBySize);

        return () => {
            clearInterval(interval);
            clearInterval(timingInterval);
            clearInterval(logInterval);
            clearInterval(cleanupInterval);
            window.removeEventListener('resize', checkDevToolsBySize);
            const overlay = document.getElementById('security-devtools-warning');
            if (overlay) overlay.remove();
        };
    }, [devtoolsAllowed]);

    // ═══════════════════════════════════════════
    // LAYER 3: Screen Capture API Detection
    // ═══════════════════════════════════════════

    useEffect(() => {
        // Detect Screen Capture API (getDisplayMedia)
        const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
        if (navigator.mediaDevices && originalGetDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia = function () {
                showSecurityAlert();
                return Promise.reject(new Error('Screen capture is disabled for security.'));
            };
        }

        // Detect visibility changes (user switching away could mean screen recording setup)
        let blurCount = 0;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                blurCount++;
                // Frequent tab switching may indicate recording setup
                if (blurCount > 10) {
                    // Reset after threshold
                    blurCount = 0;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Restore original if needed
            if (navigator.mediaDevices && originalGetDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
            }
        };
    }, []);

    // ═══════════════════════════════════════════
    // LAYER 4: CSS Protection (injected styles)
    // ═══════════════════════════════════════════

    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.id = 'security-guard-styles';
        styleEl.textContent = `
            /* ─── Text Selection Prevention ─── */
            body, body * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
            }

            /* ─── Allow selection in input fields ─── */
            input, textarea, select, [contenteditable="true"],
            input *, textarea *, select * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }

            /* ─── Image Protection ─── */
            img {
                -webkit-user-drag: none !important;
                user-drag: none !important;
                pointer-events: auto;
                -webkit-touch-callout: none !important;
            }

            /* ─── Allow Leaflet map interaction ─── */
            .leaflet-container,
            .leaflet-container * {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                -webkit-user-drag: auto !important;
                user-drag: auto !important;
                pointer-events: auto !important;
                touch-action: auto !important;
            }

            /* ─── Allow Daum Postcode interaction ─── */
            .react-daum-postcode,
            .react-daum-postcode *,
            iframe[src*="daumcdn"],
            iframe[src*="postcode"] {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                -webkit-user-drag: auto !important;
                user-drag: auto !important;
                pointer-events: auto !important;
                touch-action: auto !important;
            }

            /* ─── Print Protection ─── */
            @media print {
                html, body {
                    display: none !important;
                    visibility: hidden !important;
                }
                body::after {
                    content: "이 페이지는 인쇄할 수 없습니다.";
                    display: block !important;
                    visibility: visible !important;
                    position: fixed;
                    inset: 0;
                    background: white;
                    color: black;
                    font-size: 24px;
                    text-align: center;
                    padding-top: 40vh;
                }
            }

            /* ─── Prevent Save-As Image ─── */
            img, video, canvas {
                -webkit-touch-callout: none !important;
            }

            /* ─── Security Alert Overlay ─── */
            #security-capture-alert {
                position: fixed;
                inset: 0;
                z-index: 2147483646;
                background: rgba(220, 38, 38, 0.97);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                animation: securityFadeIn 0.2s ease-out;
                pointer-events: all;
            }

            @keyframes securityFadeIn {
                from { opacity: 0; transform: scale(1.05); }
                to { opacity: 1; transform: scale(1); }
            }

            /* ─── Anti-iframe ─── */
            /* Prevent the site from being loaded in an iframe on other domains */
        `;
        document.head.appendChild(styleEl);

        // MutationObserver: protect the style from being removed
        const observer = new MutationObserver(() => {
            if (!document.getElementById('security-guard-styles')) {
                document.head.appendChild(styleEl.cloneNode(true));
            }
        });
        observer.observe(document.head, { childList: true });

        return () => {
            observer.disconnect();
            const el = document.getElementById('security-guard-styles');
            if (el) el.remove();
        };
    }, []);

    // ═══════════════════════════════════════════
    // LAYER 5: iframe Breakout (iframe 차단)
    // ═══════════════════════════════════════════

    useEffect(() => {
        // If this page is loaded inside an iframe on another domain, break out
        if (window.top !== window.self) {
            try {
                // Attempt to access parent — will throw if cross-origin
                // eslint-disable-next-line no-unused-expressions
                window.top.location.href;
            } catch {
                // Cross-origin iframe detected — blank the page
                document.body.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-size:24px;font-weight:bold;">이 콘텐츠는 외부 사이트에서 표시할 수 없습니다.</div>';
            }
        }
    }, []);

    // No rendered output
    return null;
};

// ═══════════════════════════════════════════
// Security Alert (캡처 시도 경고)
// ═══════════════════════════════════════════
function showSecurityAlert() {
    // Don't show if already visible
    if (document.getElementById('security-capture-alert')) return;

    const alert = document.createElement('div');
    alert.id = 'security-capture-alert';
    alert.innerHTML = `
        <div style="font-size: 72px; margin-bottom: 24px;">🛡️</div>
        <h2 style="font-size: 32px; font-weight: 900; margin-bottom: 12px; letter-spacing: -0.5px;">캡처 시도 감지</h2>
        <p style="font-size: 16px; color: rgba(255,255,255,0.8); text-align: center; max-width: 420px; line-height: 1.7;">
            화면 캡처가 감지되었습니다.<br/>
            이 플랫폼의 모든 콘텐츠는 저작권법에 의해 보호됩니다.<br/>
            무단 캡처 및 배포는 법적 책임을 수반할 수 있습니다.
        </p>
        <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 20px;">
            이 경고는 5초 후 자동으로 닫힙니다.
        </p>
    `;
    document.body.appendChild(alert);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const el = document.getElementById('security-capture-alert');
        if (el) {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }
    }, 5000);
}

export default SecurityGuard;
