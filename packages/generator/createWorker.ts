import worker from "./worker?worker"
import * as workerType from "./executeNodeSystem"
import { wrap } from "comlink"

const { DEV = false } = import.meta.env;

let workerInstance: typeof workerType;

export default (): typeof workerType => {
  if (!('window' in globalThis)) return;

  if (workerInstance) return workerInstance;

  const wrapped = wrap<typeof import("./executeNodeSystem")>(new worker());

  let res: Promise<unknown>;

  workerInstance = {
    async executeNodeSystem(p: PlantProject, s: Partial<PlantariumSettings>) {
      if (res) return res;

      res = DEV ? workerType.executeNodeSystem(p, s) : wrapped.executeNodeSystem(p, s);

      const result = await res;

      res = undefined;
      return result

    }
  };

  return workerInstance;
}
