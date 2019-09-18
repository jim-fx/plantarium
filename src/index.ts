import "./index.scss";
import "./themes.scss";
import "whatwg-fetch";

import resizeTables from "./helpers/resizeTable";
import { version } from "../package.json";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("sw.js").then(
      function(reg) {},
      function(err) {
        // registration failed :(
        console.error(err);
      }
    );
  });
} else {
  alert(
    `
    This application won't work for you right now, 
    as your browser seems a bit old, support is planned.
    `
  );
}

//Import all the stages
import Stage from "./components/stages/stageClass";
import { stemConfig, branchConfig, leafConfig, ioConfig, settingsConfig } from "./config/index";
import display from "./components/display";
import { default as importerStage } from "./components/io/importer";
import projectManager from "./components/project-manager";

(() => {
  resizeTables(<HTMLTableElement>document.querySelector("table"));

  (<HTMLElement>document.getElementById("version")).innerHTML = "v" + version;

  //Initialize all the stages
  const stemStage = new Stage(stemConfig);
  const branchStage = new Stage(branchConfig);
  const leafStage = new Stage(leafConfig);
  const IOStage = new Stage(ioConfig);
  const displayStage = display;
  const settingsStage = new Stage(settingsConfig);

  //Connect all the stages
  [importerStage, stemStage, branchStage, leafStage, IOStage, settingsStage, displayStage, projectManager].forEach((s: Stage, i, a) => s.connect(a[i + 1]));

  projectManager.init();
})();
