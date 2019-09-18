import { version } from "../package.json";

//Service Worker Part
self.addEventListener("install", event => {
  // Perform install steps
  event.waitUntil(
    caches.open(`cache-${version}`).then(cache => {
      return cache.addAll(["/bundle.js", "/assets/*", "/favicon/*"]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});
