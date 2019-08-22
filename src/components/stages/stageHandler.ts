import logger from "../../logger";

const log = logger("stage handler");

let activeStage: Stage;
const stages = [];

export default {
  registerStage: (stage: Stage) => {
    if (!activeStage) {
      activeStage = stage;
      stage.show();
    }

    stage.onActivate(() => {
      log("activating stage " + stage.title, 2);
      if (activeStage !== stage) {
        activeStage.hide();
        activeStage = stage;
      }
    });

    stages.push(stage);
  }
};
