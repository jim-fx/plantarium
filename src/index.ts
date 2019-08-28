import "./index.scss";
import "./typography.scss";
import "babel-polyfill";
import resizeTables from "./helpers/resizeTable";

import Stage from "./components/stages/stageClass";
import { stemConfig, branchConfig, leafConfig, ioConfig, settingsConfig } from "./config/index";

import display from "./components/display";
import { importer, exporter } from "./components/io";
import projectManager from "./components/project-manager";

const importerStage = importer;
const stemStage = new Stage(stemConfig);
const branchStage = new Stage(branchConfig);
const leafStage = new Stage(leafConfig);
const IOStage = new Stage(ioConfig);
const displayStage = display;
const exporterStage = exporter;

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
