import "./display.scss";
import Renderer from "./renderer";

Renderer(<HTMLCanvasElement>document.getElementById("render-canvas"));

let nextStage: Stage;

export default {
  set pd(_pd: plantDescription) {
    nextStage.pd = _pd;
  },
  connect: (stage: Stage) => {
    nextStage = stage;
  }
};
