import * as Comlink from "comlink";

import createStemSkeleton from "./createStemSkeleton";
import createStemGeometry from "./createStemGeometry";
import noise from "./helper/noise";
import { Vec3 } from "ogl";

import { Circle, join, calculateNormals } from "./geometry";

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
    //const stemGeometry = createStemGeometry(pd.stem, settings, stemSkeleton);

    const ca = Circle(new Vec3(0, 0, 0), 1, 3, 0, 0);
    const cb = Circle(new Vec3(0, 1, 0), 1, 3, 0, 0);
    const cc = Circle(new Vec3(0, -1, 0), 1, 3, 0, 0);

    //console.log(ca);

    const cj = join(ca, cb);

    //console.log(cj);

    return cj;
  }
}

Comlink.expose(Generator);

export default Generator;
