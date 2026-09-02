const CACHE_NAME = "helloworld-offline-assets-v4";
const OFFLINE_IMAGE = "/assets/error/no-internet-1.png";
const OFFLINE_PAGE = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          [OFFLINE_PAGE, OFFLINE_IMAGE].map((url) =>
            cache
              .add(url)
              .catch((err) =>
                console.error(`[sw] failed to precache ${url}`, err),
              ),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const { pathname } = new URL(request.url);

  if (pathname === OFFLINE_IMAGE) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
            return response;
          })
          .catch(() => caches.match(request, { ignoreSearch: true }));
      }),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_PAGE)));
  }
});
