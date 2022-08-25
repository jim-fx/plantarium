import { Project } from "@plantarium/types";
import { wrap, type Remote } from "comlink";
const { DEV } = import.meta.env;

type workerType = typeof import("./worker");
let proxy: workerType["default"];

function supportsWorkerType() {
  if (!DEV) return true;
  if (!("Worker" in globalThis)) return false;
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


let workerInstance: Remote<workerType["default"]>;
async function getWorker() {
  if (workerInstance) return workerInstance;
  const worker = await import("./worker?worker");
  workerInstance = wrap<workerType>(new worker.default());
  return workerInstance;
}

let workerModule: workerType;
async function getWorkerFallback() {
  if (workerModule) return workerModule;
  workerModule = await import("./worker")
  return workerModule;
}

function createProxy(w: () => Promise<workerType["default"]>) {


  let res: ReturnType<workerType["executeNodeSystem"]>;

  return {
    async executeNodeSystem(p: Project, s: unknown) {
      if (res) return res;
      const worker = await w();
      res = worker.executeNodeSystem(p, s)
      const result = await res;
      res = undefined;
      return result
    },
    async exportToObject(p: Project, s: unknown) {
      const worker = await w();
      return worker.exportToObject(p, s)
    }

  }

}

export default () => {
  if (proxy) return proxy;

  if (supportsWorkerType()) {
    proxy = createProxy(getWorker);
  } else {
    proxy = createProxy(getWorkerFallback)
  }

  return proxy;
};
