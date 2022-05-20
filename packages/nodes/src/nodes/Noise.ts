import { join, noiseSkeleton, tube } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
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

  computeStem(parameters) {
    log("computeSkeleton", parameters);

    const { stems } = parameters.input();

    const size = parameters.size();
    const strength = parameters.strength();

    const maxDepth = Math.max(...stems.map(s => s.depth));

    stems.forEach((stem: PlantStem, i) => {
      if (stem.depth === maxDepth) {
        noiseSkeleton(stem.skeleton, strength, size, i * 200)
      }
    });

    return {
      stems
    };
  },

  computeGeometry(parameters, result, ctx) {
    const stemResX = ctx.getSetting('stemResX');

    const input = parameters?.input?.();
    const { stems } = result;

    return {
      geometry: join(
        ...[input ? input.geometry : null],
        ...stems.map(({ skeleton }) => tube(skeleton, stemResX)),
      ),
    };
  },
});

