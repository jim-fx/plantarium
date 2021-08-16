import { join } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
const log = logger('nodes.join');
const node: PlantNode = {
  title: 'Join',
  type: 'join',
  outputs: ['plant'],

  parameters: {
    inputA: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
    inputB: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
  },

  computeSkeleton(parameters, ctx) {
    log('compute skeleton', parameters, ctx);

    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA.result : inputB.result;
    }

    const { skeletons: skeletonsA } = inputA.result;
    const { skeletons: skeletonsB } = inputB.result;

    log(skeletonsA, skeletonsB);

    return {
      skeletons: [...skeletonsA, ...skeletonsB],
    };
  },
  computeGeometry(parameters) {
    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA.result : inputB.result;
    }

    const { geometry: geometryA } = inputA.result;
    const { geometry: geometryB } = inputB.result;

    const result = join(geometryA, geometryB);

    log('compute geometry', { geometryA, geometryB, result });

    return { geometry: result };
  },
};

export default node;
