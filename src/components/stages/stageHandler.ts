import logger from "../logger";
import icon from "../../assets/icons";

const log = logger("stage handler");

const stages = [];
const topbar = <HTMLElement>document.getElementById("topbar");

let activeStage: Stage;
let activeButton: HTMLButtonElement;

let activeButtonBackground = document.createElement("div");
activeButtonBackground.classList.add("button-background");
topbar.append(activeButtonBackground);

const activeStageTitle = window.location.hash.replace("#", "") || "stem";
log("default active stage: " + activeStageTitle, 3);

export default {
  registerStage: (stage: Stage, config?: UIConfig) => {
    const button = document.createElement("button");
    button.classList.add("topbar-button");

    if (config) {
      if (config.align) {
        button.classList.add("align-right");
      }

      if (config.icon) {
        button.append(icon[config.icon]);
        if (config.iconOnly) {
          button.classList.add(`only-icon`);
        } else {
          button.classList.add("button-icon");
        }
      }
    }

    if (!config.iconOnly) {
      button.innerHTML += `<p>${stage.config.title}</p>`;
    }

    button.addEventListener(
      "click",
      () => {
        if (activeStage !== stage) {
          log("activating stage " + stage.title, 3);

          activeStage.hide();
          activeStage = stage;
          window.location.hash = stage.title;
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

    if (stage.title === activeStageTitle) {
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
