/* 问道长生 · Service Worker（PWA 离线壳） */
const CACHE = 'wenda-changsheng-v16';
const APP_SHELL = [
  './',
  './index.html',
  './问道长生.html',
  './supabase-config.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL).catch(() => 0))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  // API（账号/存档/网络/健康检查）始终走网络，保证同步与一致性。
  if (url.pathname.includes('/api/')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => 0);
          }
          return res;
        })
        .catch(() => cached); // 离线时回退到缓存。
      return cached || fetchPromise;
    })
  );
});
