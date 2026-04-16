/* ═══════════════════════════════════════════════════════════════
   DESCUBRA O BRASIL — Service Worker v4
   Strategy: Cache-first for static, network-first for API
   Caches the full interactive app for offline use
═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'descubra-brasil-v4';
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/app/index.html',
  '/app/css/style.css',
  '/app/js/main.js',
  '/app/js/splash.js',
  '/app/js/maya-voice.js',
  '/app/js/states-db.js',
  '/app/js/news-rss.js',
  '/logo-descubra.png'
];

// ── Install: pre-cache shell ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching shell assets');
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: smart strategy ──
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for API calls and external resources
  if (url.pathname.startsWith('/api') || url.hostname !== location.hostname) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
