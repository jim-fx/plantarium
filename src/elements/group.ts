import "./group.scss";

const groupState = "groupState" in localStorage ? JSON.parse(localStorage.groupState) : {};
let incrementer = 0;

export default class Group {
  wrapper: HTMLElement = document.createElement("div");
  private open: boolean = false;
  private id: string;
  constructor(wrapper: HTMLElement, config: UIConfig) {
    this.id = (config.title + incrementer++).replace(/\s/g, "");

    this.wrapper.classList.add("group-wrapper");

    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("ui-group-content-wrapper");

    const toppart = document.createElement("div");
    toppart.classList.add("group-toppart");

    const triangle = document.createElement("span");
    triangle.innerHTML = "◢";
    toppart.append(triangle);

    const _title = document.createElement("h3");
    _title.innerHTML = config.title;
    toppart.append(_title);

    wrapper.append(toppart);

    contentWrapper.append(this.wrapper);

    wrapper.append(contentWrapper);

    const updateGroupState = () => {
      groupState[this.id] = this.open;
      localStorage.setItem("groupState", JSON.stringify(groupState));
    };

    let timeout: NodeJS.Timeout;

    const open = () => {
      timeout && clearTimeout(timeout);
      toppart.classList.add("group-open");
      this.wrapper.classList.add("group-open");
      contentWrapper.style.maxHeight = this.wrapper.getBoundingClientRect().height + "px";

      timeout = setTimeout(() => {
        contentWrapper.style.maxHeight = "5000px";
      }, 300);
    };

    const close = () => {
      timeout && clearTimeout(timeout);
      toppart.classList.remove("group-open");
      this.wrapper.classList.remove("group-open");
      contentWrapper.style.maxHeight = "0px";
    };

    toppart.addEventListener(
      "click",
      () => {
        this.open = !this.open;
        this.open ? open() : close();
        updateGroupState();
      },
      false
    );

    if (this.id in groupState) {
      this.open = groupState[this.id];
      groupState[this.id] && open();
    } else {
      this.open = !!config.open;
      config.open && open();
    }
  }
}
