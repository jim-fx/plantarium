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

    const { skeletons: skeletonsA, allSkeletons: allSkeletonsA } =
      inputA.result;
    const { skeletons: skeletonsB, allSkeletons: allSkeletonsB } =
      inputB.result;

    log(skeletonsA, skeletonsB);

    const skeletons = [...skeletonsA, ...skeletonsB];
    const allSkeletons = [];

    if (allSkeletonsA) {
      allSkeletons.push(...allSkeletonsA);
    }
    if (allSkeletonsB) {
      allSkeletons.push(...allSkeletonsB);
    }

    return {
      allSkeletons,
      skeletons,
    };
  },
  computeGeometry(parameters) {
    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA.result : inputB.result;
    }

    const { geometry: geometryA, instances: instancesA } = inputA.result;
    const { geometry: geometryB, instances: instancesB } = inputB.result;

    const result = join(geometryA, geometryB);

    const instances = [];

    if (instancesA) {
      instances.push(...instancesA);
    }
    if (instancesB) {
      instances.push(...instancesB);
    }

    log('compute geometry', { geometryA, geometryB, result });

    return { geometry: result, instances };
  },
};

export default node;
