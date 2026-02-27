// ─── SpaceMatch Service Worker ───
// 네트워크 우선, 캐시 폴백 + 웹 푸시 알림 지원

const CACHE_NAME = 'spacematch-v5';
const STATIC_ASSETS = [
    '/manifest.json'
];

// Install: 기본 에셋만 캐시
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: 이전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch: 네트워크 우선, 실패 시 캐시
self.addEventListener('fetch', (event) => {
    // API 요청은 캐시하지 않음 (보안)
    if (event.request.url.includes('/api/')) {
        return;
    }

    // HTML 네비게이션 요청은 항상 네트워크에서 가져옴 (캐시 X)
    if (event.request.mode === 'navigate' || event.request.url.endsWith('/index.html') || event.request.url.endsWith('/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                // 오프라인 fallback: 네트워크 연결 없으면 안내 페이지
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    return new Response(
                        '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#666"><div style="text-align:center"><h2>오프라인 상태입니다</h2><p>인터넷 연결을 확인 후 새로고침 해주세요.</p></div></body></html>',
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
                });
            })
        );
        return;
    }

    // HTTPS 요청만 캐시 (보안)
    if (!event.request.url.startsWith('https://') && !event.request.url.startsWith('http://localhost')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 유효한 응답만 캐시 (JS/CSS 등 정적 에셋)
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// ─── Push 알림 수신 ───
self.addEventListener('push', (event) => {
    let data = {
        title: 'SpaceMatch',
        body: '새로운 알림이 있습니다.',
        icon: '/favicon.png',
        badge: '/favicon.png',
        url: '/'
    };

    try {
        if (event.data) {
            const text = event.data.text();
            try {
                const payload = JSON.parse(text);
                data = { ...data, ...payload };
            } catch (jsonErr) {
                // JSON 파싱 실패 시 텍스트 그대로 사용
                data.body = text;
            }
        }
    } catch (e) {
        // data 읽기 자체 실패 시 기본값 사용
    }

    const options = {
        body: data.body,
        icon: data.icon || '/favicon.png',
        badge: data.badge || '/favicon.png',
        tag: data.tag || 'spacematch-' + Date.now(),
        renotify: true,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            timestamp: data.timestamp || Date.now()
        },
        actions: [
            {
                action: 'open',
                title: '확인하기'
            },
            {
                action: 'close',
                title: '닫기'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// ─── 알림 클릭 처리 ───
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    // '닫기' 액션이면 그냥 닫기
    if (event.action === 'close') {
        return;
    }

    // 이미 열린 탭이 있으면 포커스, 없으면 새 탭 열기
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // 같은 origin의 열린 탭 찾기
                for (const client of windowClients) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // 열린 탭이 없으면 새로 열기
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// ─── 알림 닫기 이벤트 (분석용) ───
self.addEventListener('notificationclose', (event) => {
    // 향후 알림 닫기 추적에 활용 가능
    console.log('[SW] Notification closed:', event.notification.tag);
});
