// Retire the old site-wide cache. The app owns its worker at app/sw.js.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all(['descubra-brasil-v1', 'descubra-brasil-v5'].map(name => caches.delete(name)))
    .then(() => self.clients.claim()));
});
