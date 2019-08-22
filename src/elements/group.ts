import "./group.scss";

export default class Group {
  wrapper: HTMLElement;
  private open: boolean = false;
  constructor(wrapper: HTMLElement, title: string) {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("group-wrapper");

    const toppart = document.createElement("div");
    toppart.classList.add("group-toppart");
    toppart.addEventListener(
      "click",
      () => {
        this.open = !this.open;
        if (this.open) {
          toppart.classList.add("group-open");
          this.wrapper.classList.add("group-open");
        } else {
          toppart.classList.remove("group-open");
          this.wrapper.classList.remove("group-open");
        }
      },
      false
    );

    const triangle = document.createElement("span");
    triangle.innerHTML = "◢";
    toppart.append(triangle);

    const _title = document.createElement("h3");
    _title.innerHTML = title;
    toppart.append(_title);

    wrapper.append(toppart);

    wrapper.append(this.wrapper);

    toppart.click();
  }
}
