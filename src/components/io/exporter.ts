import generateModel from "../model-generator";
import convertToObj from "./convertToOBJ";
import settings from "../settings";
import { obj as downloadOBJ } from "../../helpers/download";

export default {
  download: async function(pd: plantDescription, filetype: string = "obj") {
    const o = await generateModel(pd, settings.object);
    const string = convertToObj(o[0]);
    downloadOBJ(string, pd.meta.name);
  }
};
