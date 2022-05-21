import { createWorker } from "@plantarium/generator";
import { toOBJ } from "@plantarium/geometry";
import parseOBJ from "@plantarium/geometry/src/helpers/parseOBJ";
import { download } from "@plantarium/helpers";
import type { PlantariumSettings, PlantProject } from "@plantarium/types";
import { createToast } from "@plantarium/ui";

const worker = createWorker();

export default async function exportModel(p: PlantProject, s: PlantariumSettings, type: "obj" | "gltf") {

  const res = await worker?.exportToObject(p, s);

  if (res?.errors?.length) {
    createToast(res.errors[0], { type: "error" })
    return;
  }


  download.obj(res, "plant-" + (p?.meta?.name || p?.meta?.id))

}
