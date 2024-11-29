const CACHE_NAME = "easy-park-cache-v1";
const urlsToCache = [
  "./index.html",
  "./reservation.html",
  "./res/",
  "./css/style.css",
  "./res/favicons/android-chrome-192x192.png",
  "./res/favicons/android-chrome-512x512.png",
  "./res/favicons/apple-touch-icon.png",
  "./res/favicons/favicon-16x16.png",
  "./res/favicons/favicon-32x32.png",
  "./res/images/file_icon.png",
  "./res/images/presentation-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching resources");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache");
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
