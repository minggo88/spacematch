/**
 * 웹 푸시 알림 구독 관리 유틸리티
 * 
 * 사용법:
 *   import { subscribeToPush, unsubscribeFromPush } from '../utils/pushNotifications';
 *   await subscribeToPush();
 */

const API_BASE = '/api/notifications/push_subscription.php';

/**
 * VAPID 공개키를 서버에서 가져오기
 */
async function getVapidPublicKey() {
    try {
        const res = await fetch(API_BASE, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.publicKey) {
            return data.publicKey;
        }
        return null;
    } catch (e) {
        console.error('[Push] VAPID 키 가져오기 실패:', e);
        return null;
    }
}

/**
 * URL-safe base64를 Uint8Array로 변환
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * 서비스 워커 등록 및 Push 구독 수행
 * @returns {boolean} 성공 여부
 */
export async function subscribeToPush() {
    try {
        // 지원 여부 확인
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('[Push] 이 브라우저에서 웹 푸시를 지원하지 않습니다.');
            return false;
        }

        // 알림 권한 확인
        if (Notification.permission === 'denied') {
            console.warn('[Push] 알림 권한이 거부되어 있습니다.');
            return false;
        }

        // 알림 권한이 아직 없으면 요청하지 않음 (NotificationPrompt가 처리)
        if (Notification.permission !== 'granted') {
            return false;
        }

        // 서비스 워커 등록
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        await navigator.serviceWorker.ready;

        // 이미 구독되어 있는지 확인
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // VAPID 공개키 가져오기
            const vapidPublicKey = await getVapidPublicKey();
            if (!vapidPublicKey) {
                console.error('[Push] VAPID 공개키를 가져올 수 없습니다.');
                return false;
            }

            // Push 구독 요청
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });
        }

        // 서버에 구독 정보 저장
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(subscription.toJSON())
        });

        const data = await res.json();
        if (data.success) {
            console.log('[Push] ✅ 푸시 알림 구독 완료');
            return true;
        } else {
            console.error('[Push] 구독 저장 실패:', data.message);
            return false;
        }

    } catch (e) {
        console.error('[Push] 구독 오류:', e);
        return false;
    }
}

/**
 * Push 구독 해제
 * @returns {boolean} 성공 여부
 */
export async function unsubscribeFromPush() {
    try {
        if (!('serviceWorker' in navigator)) return false;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // 서버에서 구독 삭제
            await fetch(API_BASE, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ endpoint: subscription.endpoint })
            });

            // 브라우저에서 구독 해제
            await subscription.unsubscribe();
            console.log('[Push] ✅ 푸시 알림 구독 해제 완료');
        }

        return true;
    } catch (e) {
        console.error('[Push] 구독 해제 오류:', e);
        return false;
    }
}

/**
 * 현재 Push 구독 상태 확인
 * @returns {'subscribed' | 'not-subscribed' | 'denied' | 'unsupported'}
 */
export async function getPushStatus() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return 'unsupported';
    }

    if (Notification.permission === 'denied') {
        return 'denied';
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription ? 'subscribed' : 'not-subscribed';
    } catch (e) {
        return 'not-subscribed';
    }
}
