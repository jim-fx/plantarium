import { join, noiseSkeleton, tube } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { PlantStem } from '@plantarium/types';
import { typeCheckNode } from '../types';
const log = logger('nodes.noise');

export default typeCheckNode({
  title: 'Break',
  type: 'break',
  outputs: ['plant'],

  meta: {
    description: `Randomly breaks of stems`
  },

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
      required: true
    },
    chance: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.05,
      value: 0.1,
    },
    min: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.2,
    },
    max: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
  },

  computeStem(parameters, ctx) {
    log("computeSkeleton", parameters);

    const { stems } = parameters.input();

    const min = parameters.min();
    const max = parameters.max();

    const maxDepth = Math.max(...stems.map(s => s.depth));

    console.log(maxDepth)

    let processingStems = stems.filter(s => s.depth === maxDepth);

    processingStems.forEach((stem: PlantStem, i) => {
      const a = i / processingStems.length;
      const chance = parameters.chance(a);
      const rand = ctx.n1dn(10000);

      // Break of random
      if (rand < chance) {
        const breakOf = min + ctx.n1dn(10000) * (max - min);

        const i = Math.floor(breakOf * (stem.skeleton.length / 4)) * 4;
        stem.skeleton = stem.skeleton.slice(0, i);

        // stem.skeleton[i - 4] = stem.skeleton[i - 7];
        // stem.skeleton[i - 3] = stem.skeleton[i - 6];
        // stem.skeleton[i - 2] = stem.skeleton[i - 5];
        // stem.skeleton[i - 1] = 0;
      }
    });

    return {
      stems
    };
  },
});

