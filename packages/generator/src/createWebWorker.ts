import createWebWorker from './webWorker?worker=external';
import { wrap } from 'comlink';

export default () => {
  const worker = createWebWorker();

  const wrapped = wrap<{
    plant: (rootNode: NodeResult, s: PlantariumSettings) => GeometryResult;
  }>(worker);

  let isRunning = false;

  async function plantProxy(rootNode: NodeResult, s: PlantariumSettings) {
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
