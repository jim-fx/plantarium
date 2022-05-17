import worker from "./worker?worker"
import workerType from "./worker";
import { executeNodeSystem } from "./executeNodeSystem"
import { wrap } from "comlink"

const { DEV = false } = import.meta.env;

export default (): typeof workerType => {
  if (!('window' in globalThis)) return;

  const wrapped = wrap<typeof import("./executeNodeSystem")>(new worker());

  let res: Promise<unknown>;

  return {
    async executeNodeSystem(p: PlantProject, s: Partial<PlantariumSettings>) {
      if (res) return res;

      res = DEV ? executeNodeSystem(p, s) : wrapped.executeNodeSystem(p, s);

      const result = await res;

      res = undefined;
      return result

    }
  };
}
