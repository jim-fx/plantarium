import worker from "./worker?worker"
import { wrap } from "comlink"
import { PlantProject } from "@plantarium/types";

const { DEV = false } = import.meta.env;

type workerType = typeof import("./executeNodeSystem");

let workerInstance: workerType;
let workerModule: workerType;

function supportsWorkerType() {
  let supports = false;
  const tester = {
    get type() { supports = true; return false } // it's been called, it's supported
  };
  try {
    //@ts-ignore
    new Worker('blob://', tester);
  } finally {
    return supports;
  }
}

export default (): typeof import("./executeNodeSystem") => {
  if (!('window' in globalThis)) return;

  if (workerInstance) return workerInstance;
  if (workerModule) return workerModule;

  const wrapped = wrap<typeof import("./executeNodeSystem")>(new worker());

  let res: Promise<unknown>;

  workerInstance = {
    async executeNodeSystem(p: PlantProject, s: unknown) {
      if (res) return res;

      if (DEV && !supportsWorkerType()) {
        workerModule = await import("./executeNodeSystem")
        res = workerModule.executeNodeSystem(p, s);
      } else {
        res = wrapped.executeNodeSystem(p, s)
      }

      const result = await res;

      res = undefined;
      return result

    }
  };

  return workerInstance;
}
