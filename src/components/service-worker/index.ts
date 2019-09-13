if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/"
      })
      .then(
        function(registration) {},
        function(err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
  });
} else {
  alert(
    `
    This application won't work for you right now, 
    as your browser seems a bit old, support is planned.
    `
  );
}

import { wrap } from "comlink";
import Overlay from "../overlay";
import Renderer from "../renderer";

let sw;
//Initializing
const init = new Promise(async res => {
  //@ts-ignore
  const _instance = await new (wrap(new Worker("sw.js")))();
  sw = _instance;
  res();
});

export default {
  generate: async (_pd: plantDescription, settings?: settings) => {
    await init;
    const s = performance.now();
    const model = await sw.generate(_pd, settings);
    Overlay.gen(performance.now() - s);
    Renderer.render(model);
  },
  generateModel: async (_pd: plantDescription, settings?: settings[]) => {
    const models = await sw.generateModel(_pd, settings);
    return models;
  }
};
