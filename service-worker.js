self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("bco-cache").then((cache) =>
      cache.addAll([
        "./",
        "index.html",
        "styles.css",
        "script.js",
        "team-logo.png",
        "manifest.json"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});