import generateModel from "../model-generator";
import convertToObj from "./convertToOBJ";
import settings from "../settings";
import getSeed from "../../helpers/getSeed";
import { obj as downloadOBJ } from "../../helpers/download";

export default {
  download: async function(pd: plantDescription) {
    const amount = settings.get("exp_amount") || 1;
    const seed = settings.get("exp_seed") || settings.get("seed") || getSeed();
    const useRandomSeed = !!settings.get("exp_useRandomSeed");

    const models = await Promise.all(
      new Array(amount).fill(null).map(async () => {
        const s = JSON.parse(JSON.stringify(settings.object));
        if (useRandomSeed) {
          s.seed = getSeed();
        } else {
          s.seed = seed;
        }
        return await generateModel(pd, s);
      })
    );
    models
      .map(o => convertToObj(o))
      .forEach((str, i) => {
        const name = amount === 1 ? pd.meta.name : pd.meta.name + "_var" + (i + 1);
        downloadOBJ(str, name);
      });
  }
};
