import * as Comlink from "comlink";

import createStemSkeleton from "./createStemSkeleton";
import createStemGeometry from "./createStemGeometry";
import noise from "./helper/noise";
import { calculateNormals, join } from "./geometry";
import draw from "./helper/draw";

let oldSettings: string;

const stemSkeletons: Float32Array[] = [];

const debugLines: Float32Array[] = [];
draw.setSkeleton(debugLines);

class Generator {
  constructor() {}

  generate(pd: plantDescription, settings: settings) {
    //If the settings change force regeneration of all parts
    const newSettings = JSON.stringify(settings);
    settings.forceUpdate = oldSettings !== newSettings;
    oldSettings = newSettings;

    //Load seed from settings
    if (settings.useRandomSeed === true) {
      noise.seed = Math.floor(Math.random() * 100000);
    } else if (typeof settings.seed === "number") {
      noise.seed = settings.seed;
    }

    stemSkeletons.length = pd.stem.amount || 1;
    debugLines.length = 0;
    for (let i = 0; i < stemSkeletons.length; i++) {
      stemSkeletons[i] = createStemSkeleton(pd.stem, settings, i);
    }

    const stemGeometries = stemSkeletons.map((stemSkeleton, i) => createStemGeometry(pd.stem, settings, stemSkeleton, i));

    const final = calculateNormals(join(...stemGeometries));

    final.skeleton = stemSkeletons.concat(debugLines);

    return final;
  }
}

Comlink.expose(Generator);

export default Generator;
