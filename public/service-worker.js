// ─── SpaceMatch Service Worker ───
// 네트워크 우선, 캐시 폴백 전략

const CACHE_NAME = 'spacematch-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
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

    // HTTPS 요청만 캐시 (보안)
    if (!event.request.url.startsWith('https://') && !event.request.url.startsWith('http://localhost')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 유효한 응답만 캐시
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
