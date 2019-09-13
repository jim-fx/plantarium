import sw from "../service-worker";
import convertToObj from "./convertToOBJ";
import { obj as downloadOBJ } from "../../helpers/download";

export default {
  download: async function(pd: plantDescription, filetype: string = "obj") {
    const o = await sw.generateModel(pd);
    const string = convertToObj(o[0]);
    downloadOBJ(string, pd.meta.name);
  }
};
