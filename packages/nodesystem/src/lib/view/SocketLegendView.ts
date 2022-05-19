import "./SocketLegendView.scss"
import type NodeSystemView from "./NodeSystemView";

export default class SocketLegendView {

  wrapper: HTMLElement;

  constructor(view: NodeSystemView) {


    this.wrapper = document.createElement("div");
    this.wrapper.addEventListener("click", () => {
      this.wrapper.focus()
    })
    this.wrapper.classList.add("nodesystem-socket-legend");
    view.wrapper.appendChild(this.wrapper)


    this.updateTypes(Object.entries(view.colorStore.colors))

    view.colorStore.on("colors", (types) => {
      this.updateTypes(types as any)
    })

  }


  private updateTypes(types: [string, string][]) {
    this.wrapper.style.setProperty("--max-height", (1 + types.length) * 30 + "px")
    this.wrapper.innerHTML = `<input type="checkbox"/><div class="socket-legend-title">Legend</div> 
<div class="socket-legend-type-wrapper">
${types.map(([type, col]) => `
<div class="socket-legend-col" style="background-color:${col}"></div><div class="socket-legend-type">${type}</div>
`).join("")}
</div>
`
  }

}
