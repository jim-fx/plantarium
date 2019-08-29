import * as Comlink from "comlink";
import Generator from "../model-generator";
import Overlay from "./overlay";
import Renderer from "./renderer";
import settings from "../settings";

let instance: Generator;
let pd: plantDescription;

const generate = async (_pd: plantDescription) => {
  const s = performance.now();
  const model = await instance.generate(_pd, settings.object);
  Overlay.gen(performance.now() - s);
  Renderer.render(model);
};

//Initializing
(async () => {
  const GeneratorWrapper = Comlink.wrap(new Worker("generator.js"));
  let _instance = await new GeneratorWrapper();
  instance = _instance;
  if (pd) {
    generate(pd);
  }
})();

export default function(_pd: plantDescription) {
  pd = _pd;
  if (instance && _pd) {
    generate(_pd);
  }
}
