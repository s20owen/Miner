const CACHE_NAME = "orbit-mine-v2";
const ASSETS = ["./", "./index.html", "./styles.css", "./main.js", "./manifest.webmanifest", "./icon.svg", "./apple-launch-1125x2436.png",
  "./apple-launch-1179x2556.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
