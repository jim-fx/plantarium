import "./button.scss";

export default class Button implements Button {
  wrapper: HTMLElement;

  private listeners: Function[];
  private element: HTMLButtonElement;
  private _active: Boolean = false;

  constructor(wrapper: HTMLElement, text: string = "Button") {
    this.wrapper = wrapper;

    this.element = document.createElement("button");
    this.element.innerHTML = text;
    this.element.addEventListener(
      "click",
      () => {
        this.listeners.forEach(cb => cb());
      },
      false
    );

    this.wrapper.append(this.element);

    this.listeners = [];
  }

  get active() {
    return this._active;
  }

  set active(v) {
    v
      ? this.element.classList.add("button-active")
      : this.element.classList.remove("button-active");

    this._active = v;
  }

  onClick(cb: Function) {
    this.listeners.push(cb);
  }
}
