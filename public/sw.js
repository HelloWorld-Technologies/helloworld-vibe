const CACHE_NAME = "helloworld-offline-assets-v1";
const OFFLINE_IMAGE = "/assets/error/no-internet-1.png";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_IMAGE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (new URL(event.request.url).pathname !== OFFLINE_IMAGE) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse ?? fetch(event.request);
    }),
  );
});
