/// <reference types="vite-plugin-comlink/client" />

// import { wrap } from 'comlink';
import type plant from '../plant';
// import createWebWorker from 'worker:./webWorker';

const wrapped = new ComlinkWorker(new URL('./webWorker', import.meta.url), {/* normal Worker options*/ })

export default () => {
  if (!('window' in globalThis)) return;

  // const worker = createWebWorker();
  //
  // const wrapped = wrap<{
  //   plant: (
  //     rootNode: NodeResult,
  //     s: PlantariumSettings,
  //   ) => ReturnType<typeof plant>;
  // }>(worker);

  let isRunning = false;

  async function plantProxy(
    rootNode: NodeResult,
    s: Partial<PlantariumSettings>,
  ) {
    if (isRunning) return;
    isRunning = true;

    const result = await wrapped.plant(rootNode, s);

    isRunning = false;
    return result;
  }

  return {
    plant: plantProxy,
  };
};
