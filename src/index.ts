import "./index.scss";
import "./typography.scss";
import "babel-polyfill";
import resizeTables from "./helpers/resizeTable";

import Stage from "./components/stages/stageClass";
import StageHandler from "./components/stages/stageHandler";
import stagesConfig from "./components/stages/config";

import "./components/display";

const pd = {
  stem: {}
};

const stages = stagesConfig
  .map(stageConfig => new Stage(stageConfig, pd))
  .forEach(_stage => StageHandler.registerStage(_stage));

resizeTables(<HTMLTableElement>document.querySelector("table"));
