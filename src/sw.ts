import { expose } from "comlink";

import generate from "./components/model-generator";
import data from "./components/data-service";
import { version } from "../package.json";

//Service Worker Part
self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(`cache-${version}`).then(function(cache) {
      return cache.addAll(["/", "/bundle.*", "/assets/*"]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

let settings: settings = <settings>{};

//Expose the functions
class sw {
  generate = (pd: plantDescription, _s: settings = settings) => {
    return generate(pd, _s);
  };
  generateModel = (pd: plantDescription, _s: settings[] = [settings]) => {
    return _s.map(s => generate(pd, s, false));
  };
  data = data;
  settings = (s: settings) => {
    settings = s;
  };
  constructor() {}
}

expose(sw);
export default sw;
