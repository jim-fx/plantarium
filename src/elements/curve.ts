import "./curve.scss";
import UIElement from "./element";

const size = 200;

export default class UICurve extends UIElement {
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;

    const canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("canvas-wrapper");
    canvasWrapper.append(canvas);
    this.wrapper.append(canvasWrapper);

    this.wrapper.classList.add("curve-wrapper");
  }
}
