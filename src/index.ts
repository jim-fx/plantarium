import "./index.scss";
import "./typography.scss";
import "babel-polyfill";
import resizeTables from "./helpers/resizeTable";

import Stage from "./components/stages/stageClass";
import { stemConfig, branchConfig, leafConfig, IOConfig } from "./config";

import display from "./components/display";
import { importer, exporter } from "./components/io";

import defaultPD from "./assets/defaultPlantDefinition";

const importerStage = importer;
const stemStage = new Stage(stemConfig);
const branchStage = new Stage(branchConfig);
const leafStage = new Stage(leafConfig);
const IOStage = new Stage(IOConfig);
const displayStage = display;
const exporterStage = exporter;

importerStage.connect(stemStage);
stemStage.connect(branchStage);
branchStage.connect(leafStage);
leafStage.connect(displayStage);
displayStage.connect(IOStage);
IOStage.connect(exporterStage);

importer.init("pd" in localStorage ? JSON.parse(localStorage.pd) : defaultPD);

resizeTables(<HTMLTableElement>document.querySelector("table"));
