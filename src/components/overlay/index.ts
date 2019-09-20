import graph from "./graph";
import debug3D from "./3d";
import popup from "./popup";

const wrapper = <HTMLElement>document.getElementById("overlay-wrapper");

const renderPerf = graph("render", "ms", 0, 0, wrapper);
const generatePerf = graph("generate", "ms", 0, 100, wrapper);
const vertices = graph("vertices", "", 0, 200, wrapper);

const pdDisplay = <HTMLElement>document.getElementById("pd-display");
let showPD = false;

export default {
  renderTime: renderPerf,
  generateTime: generatePerf,
  vertices: vertices,
  debug3d: debug3D,
  popup: popup,
  pd: (_pd: plantDescription) => {
    if (!showPD) return;
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
  },
  update: (s: settings) => {
    debug3D.update(s);

    if (s["debug_generate_perf"]) {
      generatePerf.show();
      vertices.show();
    } else {
      generatePerf.hide();
      vertices.hide();
    }

    if (s["debug_render_perf"]) {
      renderPerf.show();
    } else {
      renderPerf.hide();
    }

    if (s["debug_pd"]) {
      pdDisplay.style.display = "";
      showPD = true;
    } else {
      pdDisplay.style.display = "none";
      showPD = false;
    }
  }
};
