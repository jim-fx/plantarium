import { noiseSkeleton } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { PlantStem } from '@plantarium/types';
import { typeCheckNode } from '../types';
const log = logger('nodes.noise');

export default typeCheckNode({
  title: 'Noise',
  type: 'noise',
  outputs: ['plant'],

  meta: {
    description: `The noise node applies noise to input branches.`
  },

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
      required: true
    },
    size: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.05,
      value: 1,
    },
    strength: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
  },

  compute(parameters) {
    log("computeSkeleton", parameters);

    const { stems, instances } = parameters.input();

    const size = parameters.size();
    const strength = parameters.strength();

    const maxDepth = Math.max(...stems.map(s => s.depth));

    stems.forEach((stem: PlantStem, i) => {
      if (stem.depth === maxDepth) {
        noiseSkeleton(stem.skeleton, strength, size, i * 200)
      }
    });

    return {
      stems,
      instances
    };
  }
});

