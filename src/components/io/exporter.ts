const pdDisplay = <HTMLElement>document.getElementById("pd-display");

const exp = {
  set pd(_pd: plantDescription) {
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
    localStorage.pd = JSON.stringify(_pd);
  },
  init: function(_pd: plantDescription) {
    this.pd = _pd;
  }
};

export default exp;
