const CACHE_NAME = "orbit-mine-v6";
const ASSETS = ["./", "./index.html", "./styles.css", "./main.js", "./manifest.webmanifest", "./icon.svg", "./apple-launch-1125x2436.png",
  "./apple-launch-1179x2556.png"];
const NETWORK_FIRST = new Set(["/", "/index.html", "/styles.css", "/main.js", "/manifest.webmanifest"]);

function normalizedPath(url) {
  return new URL(url).pathname;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const path = normalizedPath(event.request.url);
  if (NETWORK_FIRST.has(path)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request)),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
