import * as Comlink from "comlink";

import createStemSkeleton from "./createStemSkeleton";
import createStemGeometry from "./createStemGeometry";
import noise from "./helper/noise";
import { Vec3 } from "ogl";

import { circle, join, calculateNormals, triangle } from "./geometry";

let oldSettings: string;

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

    const stemSkeleton = createStemSkeleton(pd.stem, settings);
    const stemGeometry = createStemGeometry(pd.stem, settings, stemSkeleton);

    return calculateNormals(stemGeometry);
  }
}

Comlink.expose(Generator);

export default Generator;
