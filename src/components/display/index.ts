import "./display.scss";
import sw from "../service-worker";
import renderer from "../renderer";
import overlay from "../overlay";
import settings from "./../settings";

let nextStage: Stage;

const exp = {
  set pd(_pd: plantDescription) {
    if (nextStage) {
      nextStage.pd = _pd;
    }
    sw.generate(_pd);
  },
  init: function(_pd: plantDescription) {
    const _s = settings.object;

    renderer.update(_s);
    overlay.update(_s);

    this.pd = _pd;
    if (nextStage) {
      nextStage.init(_pd);
    }
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};

export default exp;
