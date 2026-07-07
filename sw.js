const CACHE_NAME = "my-card-v9";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "icon-ui-language.png",
  "icon-ui-contact-save.png",
  "icon-ui-call.png",
  "icon-ui-card-save.png",
  "icon-ui-brochure.png",
  "icon-ui-mobile.png",
  "icon-ui-email.png",
  "icon-ui-website.png",
  "icon-ui-address.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch((error) => {
        if (event.request.mode === "navigate") return caches.match("index.html");
        throw error;
      })
    )
  );
});
