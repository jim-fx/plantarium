import * as Comlink from "comlink";
import Circle from "./createCircle";
import p from "./parameter";
import noise from "./noise";

class Generator {
  constructor() {}

  generate(pd: plantDescription, settings: settings) {
    //Load seed from settings
    if (settings["useRandomSeed"] === true) {
      noise.seed = Math.floor(Math.random() * 100000);
    } else if (typeof settings["seed"] === "number") {
      noise.seed = settings["seed"];
    }

    return Circle(p(pd.stem.diameter), settings["stemResX"], pd.stem.height.variation, pd.stem.noiseScale);
  }
}

Comlink.expose(Generator);

export default Generator;
