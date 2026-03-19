/**
 * 마진율 계산기 트래킹 유틸리티
 * 페이지뷰와 사용자 행동 이벤트를 스페이스매치 서버로 전송
 */

// 스페이스매치 메인 서버의 API 주소 (실서버에 맞게 설정)
const TRACK_API = '/api/calc-stats/track.php'

// ── 세션 ID 생성/관리 ──
function getSessionId() {
    let sid = sessionStorage.getItem('calc_session_id')
    if (!sid) {
        sid = 'cs_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem('calc_session_id', sid)
    }
    return sid
}

// ── 디바이스 타입 감지 ──
function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase()
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
    if (/mobile|android|iphone|ipod|phone|webos|blackberry/i.test(ua)) return 'mobile'
    return 'desktop'
}

// ── 리퍼러 정리 ──
function getReferrer() {
    const ref = document.referrer
    if (!ref) return ''
    try {
        const url = new URL(ref)
        // 자기 자신 도메인은 제외
        if (url.hostname === window.location.hostname) return ''
        return ref
    } catch {
        return ref
    }
}

// ── API 호출 (비동기, 실패 시 무시) ──
async function sendTrack(payload) {
    try {
        await fetch(TRACK_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: getSessionId(),
                device_type: getDeviceType(),
                ...payload,
            }),
            // 크레덴셜 불필요 (익명 트래킹)
            keepalive: true, // 페이지 이탈 시에도 전송 완료
        })
    } catch {
        // 트래킹 실패는 무시 (사용자 경험에 영향 없음)
    }
}

// ══════════════════════════════════════════════
// 공개 API
// ══════════════════════════════════════════════

/**
 * 페이지뷰 기록
 * - 페이지 로드 시 1회 호출
 */
export function trackPageView() {
    // 중복 방지: 세션 내 1회만
    if (sessionStorage.getItem('calc_pv_sent')) return
    sessionStorage.setItem('calc_pv_sent', '1')

    sendTrack({
        type: 'pageview',
        referrer: getReferrer(),
        page_url: window.location.href,
    })
}

/**
 * 이벤트 기록
 * @param {string} eventType - 이벤트 종류 ('calculate' | 'unlock_attempt' | 'conversion')
 * @param {object} eventData - 추가 데이터 (선택)
 */
export function trackEvent(eventType, eventData = null) {
    sendTrack({
        type: 'event',
        event_type: eventType,
        event_data: eventData,
    })
}
