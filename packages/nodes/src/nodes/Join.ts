import { join } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { typeCheckNode } from '../types';
const log = logger('nodes.join');
export default typeCheckNode({
  title: 'Join',
  type: 'join',
  outputs: ['plant'],

  meta: {
    description: `The join node takes two plants and joins them to form a single new one.`
  },

  parameters: {
    inputA: {
      type: 'plant',
      label: 'plant',
      required: true,
      external: true,
    },
    inputB: {
      type: 'plant',
      label: 'plant',
      required: true,
      external: true,
    },
  },

  compute(parameters, ctx) {
    log('compute skeleton', parameters, ctx);

    const { inputA, inputB } = parameters;

    if (!inputA || !inputB) {
      return inputA ? inputA() : inputB();
    }

    const { stems: stemsA, instances: instancesA } =
      inputA()
    const { stems: stemsB, instances: instancesB } =
      inputB();

    log(stemsA, stemsB);

    const stems = [];
    if (stemsA) stems.push(...stemsA);
    if (stemsB) stems.push(...stemsB);


    const instances = []
    if (instancesA) instances.push(...instancesA)
    if (instancesB) instances.push(...instancesB)

    return {
      stems,
      instances
    };
  }
});

