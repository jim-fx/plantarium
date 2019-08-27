const pdDisplay = <HTMLElement>document.getElementById("pd-display");
const dlAnchorElem = <HTMLAnchorElement>document.getElementById("downloadAnchorElem");

let pd: plantDescription;

const exp = {
  set pd(_pd: plantDescription) {
    pd = _pd;
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
    localStorage.pd = JSON.stringify(_pd);
  },
  init: function(_pd: plantDescription) {
    this.pd = _pd;
  },
  download: (_pd: plantDescription) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_pd));
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", pd.meta.name + ".json");
    dlAnchorElem.click();
  }
};

export default exp;
