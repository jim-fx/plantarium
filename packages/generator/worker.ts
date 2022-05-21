import { executeNodeSystem } from "./executeNodeSystem";
import { expose } from "comlink"
import { PlantProject } from "@plantarium/types";
import { toOBJ } from "@plantarium/geometry";

async function exportToObject(p: PlantProject, s: unknown) {

  let res = await executeNodeSystem(p, s);

  if (res?.errors?.length) {
    return res;
  }

  return toOBJ(res.geometry);
}

expose({
  exportToObject,
  executeNodeSystem
})

export {
  executeNodeSystem,
  exportToObject,
}

export default {
  executeNodeSystem,
  exportToObject
}
