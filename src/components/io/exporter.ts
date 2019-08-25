const pdDisplay = <HTMLElement>document.getElementById("pd-display");

export default {
  set pd(_pd: plantDescription) {
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
  }
};
