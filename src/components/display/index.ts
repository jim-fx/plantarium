import "./display.scss";
import Renderer from "./renderer";
import * as Comlink from "comlink";
import _Generator from "../model-generator";
import overlay from "./overlay";
import settings from "../settings";

const _renderer = Renderer(<HTMLCanvasElement>document.getElementById("render-canvas"));

const Generator: _Generator = Comlink.wrap(new Worker("generator.js"));

let instance: _Generator;
let pd: plantDescription;

const generate = async (_pd: plantDescription) => {
  const s = performance.now();
  const model = await instance.generate(_pd, settings.object);
  overlay.gen(performance.now() - s);
  _renderer.render(model);
};

const init = async () => {
  instance = await new Generator();
  generate(pd);
};

init();

let nextStage: Stage;

export default {
  set pd(_pd: plantDescription) {
    pd = _pd;
    nextStage.pd = _pd;
    if (instance) {
      generate(_pd);
    }
  },
  init: (_pd: plantDescription) => {
    pd = _pd;
    if (nextStage) {
      nextStage.init(_pd);
      if (instance) {
        generate(_pd);
      }
    }
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
