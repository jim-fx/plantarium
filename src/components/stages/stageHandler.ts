import logger from "../../logger";

const log = logger("stage handler");

const stages = [];
const topbar = <HTMLElement>document.getElementById("topbar");

let activeStage: Stage;
let activeButton: HTMLButtonElement;

let activeButtonBackground = document.createElement("div");
activeButtonBackground.classList.add("button-background");
topbar.append(activeButtonBackground);

export default {
  registerStage: (stage: Stage) => {
    const button = document.createElement("button");
    button.innerHTML = stage.config.title;
    button.addEventListener(
      "click",
      () => {
        if (activeStage !== stage) {
          log("activating stage " + stage.title, 2);

          activeStage.hide();
          activeStage = stage;
          activeStage.show();

          activeButton.classList.remove("button-active");
          activeButton = button;
          activeButton.classList.add("button-active");

          const bounds = activeButton.getBoundingClientRect();
          activeButtonBackground.style.width = bounds.width + "px";
          activeButtonBackground.style.left = bounds.left + "px";
        }
      },
      false
    );

    if (!activeStage) {
      activeStage = stage;
      activeButton = button;
      activeButton.classList.add("button-active");

      stage.show();

      setTimeout(() => {
        const bounds = activeButton.getBoundingClientRect();
        activeButtonBackground.style.width = bounds.width + "px";
        activeButtonBackground.style.left = bounds.left + "px";
      }, 1);
    }

    topbar.append(button);
    stages.push(stage);
  }
};
