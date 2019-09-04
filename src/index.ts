import "./index.scss";
import "./themes.scss";

import resizeTables from "./helpers/resizeTable";
import { version } from "../package.json";
document.getElementById("version").innerHTML = "v" + version;

import Stage from "./components/stages/stageClass";
import { stemConfig, branchConfig, leafConfig, ioConfig, settingsConfig } from "./config/index";

import display from "./components/display";
import { default as importerStage } from "./components/io/importer";
import { default as exporterStage } from "./components/io/exporter";
import projectManager from "./components/project-manager";

const stemStage = new Stage(stemConfig);
const branchStage = new Stage(branchConfig);
const leafStage = new Stage(leafConfig);
const IOStage = new Stage(ioConfig);
const displayStage = display;

const settingsStage = new Stage(settingsConfig);

importerStage.connect(stemStage);
stemStage.connect(branchStage);
branchStage.connect(leafStage);
leafStage.connect(displayStage);
displayStage.connect(IOStage);
IOStage.connect(exporterStage);
exporterStage.connect(settingsStage);

projectManager.init();

resizeTables(<HTMLTableElement>document.querySelector("table"));
