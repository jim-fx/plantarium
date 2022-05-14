import { join } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { typeCheckNode } from '../types';
const log = logger('nodes.join');
export default typeCheckNode({
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

  computeStem(parameters, ctx) {
    log('compute skeleton', parameters, ctx);

    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA() : inputB();
    }

    const { stems: stemsA } =
      inputA()
    const { stems: stemsB } =
      inputB();

    log(stemsA, stemsB);

    const stems = [...stemsA, ...stemsB];


    return {
      stems,
    };
  },
  computeGeometry(parameters) {
    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA() : inputB();
    }

    const { geometry: geometryA, instances: instancesA } = inputA();
    const { geometry: geometryB, instances: instancesB } = inputB();

    const result = join(geometryA, geometryB);

    const instances = [];

    if (instancesA) {
      instances.push(instancesA);
    }
    if (instancesB) {
      instances.push(instancesB);
    }

    log('compute geometry', { geometryA, geometryB, result });

    return { geometry: result, instances };
  },
});

