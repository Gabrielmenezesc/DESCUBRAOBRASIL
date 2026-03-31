const CACHE_NAME = "descubra-brasil-site-v1";
const ASSETS = [
  "/DESCUBRAOBRASIL/",
  "/DESCUBRAOBRASIL/manifest.json",
  "/DESCUBRAOBRASIL/app/img/logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
