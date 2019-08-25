import "./index.scss";
import "./typography.scss";
import "babel-polyfill";
import resizeTables from "./helpers/resizeTable";

import Stage from "./components/stages/stageClass";
import StageHandler from "./components/stages/stageHandler";
import stagesConfig from "./components/stages/config";

import display from "./components/display";
import { importer, exporter } from "./components/io";

import defaultPD from "./assets/defaultPlantDefinition";

const stages: Stage[] = stagesConfig.map(stageConfig => new Stage(stageConfig));

stages.forEach((_stage: Stage) => StageHandler.registerStage(_stage));

stages.unshift(importer);

stages.push(display);

stages.push(exporter);

stages.forEach((stage: Stage, i: number) => {
  if (i < stages.length - 1) {
    stage.connect(stages[i + 1]);
  }
});

console.log(stages);

importer.pd = defaultPD;

resizeTables(<HTMLTableElement>document.querySelector("table"));
