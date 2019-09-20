import { version } from "../package.json";

const cache = [
  "android-icon-144x144.png",
  "/assets/favicon/apple-icon-72x72.png",
  "/assets/favicon/android-icon-192x192.png",
  "/assets/favicon/apple-icon-76x76.png",
  "/assets/favicon/android-icon-36x36.png",
  "/assets/favicon/apple-icon-precomposed.png",
  "/assets/favicon/android-icon-48x48.png",
  "/assets/favicon/apple-icon.png",
  "/assets/favicon/android-icon-72x72.png",
  "/assets/favicon/browserconfig.xmlandroid-icon-96x96.png",
  "/assets/favicon/favicon-16x16.png",
  "/assets/favicon/apple-icon-114x114.png",
  "/assets/favicon/favicon-32x32.png",
  "/assets/favicon/apple-icon-120x120.png",
  "/assets/favicon/favicon-96x96.png",
  "/assets/favicon/apple-icon-144x144.png",
  "/assets/favicon/favicon.icoapple-icon-152x152.png",
  "/assets/favicon/ms-icon-144x144.png",
  "/assets/favicon/apple-icon-180x180.png",
  "/assets/favicon/ms-icon-150x150.png",
  "/assets/favicon/apple-icon-57x57.png",
  "/assets/favicon/ms-icon-310x310.png",
  "/assets/favicon/apple-icon-60x60.png",
  "/assets/favicon/ms-icon-70x70.png"
];

//Service Worker Part
self.addEventListener("install", event => {
  // Perform install steps
});

/*self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      } else {
        if (cache.includes(event.request)) {
          caches
            .open(`cache-${version}`)
            .then(cache => {
              console.log(event.request);
              return cache.add(event.request);
            })
            .catch(e => {
              console.log(e);
            });
        }
        return fetch(event.request);
      }
    })
  );
});*/
