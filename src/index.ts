import "./index.scss";
import "./themes.scss";
import "whatwg-fetch";

import resizeTables from "./helpers/resizeTable";
import { version } from "../package.json";

//Import all the stages
import Stage from "./components/stages/stageClass";
import {
  stemConfig,
  branchConfig,
  leafConfig,
  ioConfig,
  settingsConfig
} from "./config/index";
import display from "./components/display";
import { default as importerStage } from "./components/io/importer";
import { default as exporterStage } from "./components/io/exporter";
import projectManager from "./components/project-manager";
import settings from "./components/settings";

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
  importerStage.connect(stemStage);
  stemStage.connect(branchStage);
  branchStage.connect(leafStage);
  leafStage.connect(displayStage);
  displayStage.connect(IOStage);
  IOStage.connect(settingsStage);
  settingsStage.connect(projectManager);

  projectManager.init();
})();
