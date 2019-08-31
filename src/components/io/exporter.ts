import projectManager from "../project-manager";
import overlay from "../display/overlay";

let pd: plantDescription;
let nextStage: Stage;

const exp = {
  set pd(_pd: plantDescription) {
    pd = _pd;
    overlay.pd(_pd);
    projectManager.save(_pd);
  },
  get pd(): plantDescription {
    return pd;
  },
  init: function(_pd: plantDescription) {
    this.pd = _pd;
    if (nextStage) {
      nextStage.init(_pd);
    }
  },
  connect: (_nextStage: Stage) => {
    nextStage = _nextStage;
  }
};

export default exp;
