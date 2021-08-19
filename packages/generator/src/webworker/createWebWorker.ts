import { wrap } from 'comlink';
import type plant from '../plant';
import createWebWorker from './webWorker?worker=external';

export default () => {
  const worker = createWebWorker();

  const wrapped = wrap<{
    plant: (
      rootNode: NodeResult,
      s: PlantariumSettings,
    ) => ReturnType<typeof plant>;
  }>(worker);

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
