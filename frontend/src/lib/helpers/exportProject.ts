import { createWorker } from "@plantarium/generator";
import { toOBJ } from "@plantarium/geometry";
import { download } from "@plantarium/helpers";
import type { PlantariumSettings, PlantProject } from "@plantarium/types";
import { createToast } from "@plantarium/ui";

const worker = createWorker();

export default async function exportModel(p: PlantProject, s: PlantariumSettings, type: "obj" | "gltf") {

  const res = await worker.executeNodeSystem(p, s);

  if (!res.geometry) {
    if (res.errors) {
      createToast(res.errors[0], { type: "error" })
    }
    return;
  }

  if (type === "obj") {
    const output = toOBJ(res.geometry);
    download.obj(output, "plant-" + (p?.meta?.name || p?.meta?.id))
  }

}
