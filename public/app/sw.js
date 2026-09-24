// Cache only this app's public shell; never cache authentication or API traffic.
const CACHE_PREFIX = 'descubra-app-' + new URL(self.registration.scope).pathname + '-';
const CACHE_NAME = CACHE_PREFIX + 'mobile-v2';
const ASSETS = [
  "index.html",
  "gamificacao.html",
  "css/style.css?v=4.1",
  "css/gamificacao.css",
  "css/mobile.css",
  "js/main.js?v=4.1",
  "js/mobile.js",
  "js/maya-voice.js",
  "js/states-db.js",
  "js/news-rss.js",
  "js/gamificacao.js",
  "manifest.json",
  "../icon-192.png",
  "../icon-512.png",
  "../logo-descubra.png"
];
const SHELL = new Set(ASSETS.map(path => new URL(path, self.location.href).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([...SHELL])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !SHELL.has(event.request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
