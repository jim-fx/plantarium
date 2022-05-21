import worker from "./worker?worker"
import { type Remote, wrap } from "comlink"
import { PlantProject } from "@plantarium/types";

const { DEV } = import.meta.env;

type workerType = typeof import("./worker");
let proxy: workerType["default"];
let workerInstance: Remote<workerType>;
let workerModule: workerType;

function supportsWorkerType() {
  if (!DEV) return true;
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

export default () => {
  if (!('window' in globalThis)) return;

  if (proxy) return proxy;

  let res: ReturnType<workerType["executeNodeSystem"]>;

  if (supportsWorkerType()) {
    console.log("WOORKER");
    proxy = {
      async executeNodeSystem(p: PlantProject, s: unknown) {
        if (res) return res;
        if (!workerInstance) workerInstance = wrap<typeof import("./worker")>(new worker());
        res = workerInstance.executeNodeSystem(p, s)
        const result = await res;
        res = undefined;
        return result

      },
      async exportToObject(p: PlantProject, s: unknown) {
        if (!workerInstance) workerInstance = wrap<typeof import("./worker")>(new worker());
        return workerInstance.exportToObject(p, s)
      },
    };
    return proxy;
  }

  console.log("NO WOORKER");

  proxy = {
    async executeNodeSystem(p: PlantProject, s: unknown) {
      if (res) return res;
      if (!workerModule) workerModule = await import("./worker")
      res = workerModule.executeNodeSystem(p, s);
      const result = await res;
      res = undefined;
      return result

    },
    async exportToObject(p: PlantProject, s: unknown) {
      if (!workerModule) workerModule = await import("./worker")
      return workerModule.exportToObject(p, s);
    },
  };

  return proxy;


};
