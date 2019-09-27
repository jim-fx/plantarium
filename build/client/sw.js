(function () {
  'use strict';

  self.addEventListener("install", function (event) {// Perform install steps
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

}());
//# sourceMappingURL=sw.js.map
