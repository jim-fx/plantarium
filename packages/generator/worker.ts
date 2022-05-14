/// <reference types="vite-plugin-comlink/client" />

// import { wrap } from 'comlink';
import * as worker from "./executeNodeSystem"

const wrapped = new ComlinkWorker(new URL('./executeNodeSystem', import.meta.url), {/* normal Worker options*/ }) as typeof worker;

const { DEV = false } = import.meta.env;

export default () => {
  if (!('window' in globalThis)) return;

  if (DEV) {
    // Because firefox doesnt support modules in workers
    // we dont use a worker in dev mode
    return worker;
  }

  let res: Promise<unknown>;

  async function executeNodeSystem(
    rootNode: PlantProject,
    s: Partial<PlantariumSettings>,
  ) {
    if (res) return res;

    res = wrapped.executeNodeSystem(rootNode, s);

    const result = await res;

    res = undefined;
    return result
  }

  return {
    executeNodeSystem
  };
}
