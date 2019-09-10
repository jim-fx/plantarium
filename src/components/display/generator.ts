import * as Comlink from "comlink";
import Generator from "../model-generator";
import Overlay from "./overlay";
import Renderer from "./renderer";
import settings from "../settings";

let instance: Generator;
let pd: plantDescription;
let computing: boolean = false;
let pdInBacklog: boolean = false;

const generate = async (_pd: plantDescription) => {
  computing = true;
  pdInBacklog = false;

  const s = performance.now();
  const model = await instance.generate(_pd, settings.object);
  Overlay.gen(performance.now() - s);
  Renderer.render(model);

  computing = false;

  if (pdInBacklog) {
    generate(pd);
  }
};

//Initializing
(async () => {
  const GeneratorWrapper = Comlink.wrap(new Worker("sw.js"));
  const _instance = await new GeneratorWrapper();
  instance = _instance;
  if (pd) {
    generate(pd);
  }
})();

export default (_pd: plantDescription) => {
  pd = _pd;
  if (instance && _pd) {
    if (computing) {
      pdInBacklog = true;
    } else {
      generate(pd);
    }
  }
};
