import "./display.scss";
import generateModel from "../model-generator";
import renderer from "../renderer";
import overlay from "../overlay";
import settings from "./../settings";

let nextStage: Stage;

async function generate(pd) {
  const model = await generateModel(pd, settings.object);
  renderer.render(model);
}

export default {
  set pd(_pd: plantDescription) {
    if (nextStage) nextStage.pd = _pd;
    overlay.pd(_pd);
    generate(_pd);
  },
  init: function(_pd: plantDescription) {
    const _s = settings.object;

    renderer.update(_s);
    overlay.update(_s);

    this.pd = _pd;
    if (nextStage) nextStage.init(_pd);
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
