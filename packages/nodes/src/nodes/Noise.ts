import { noise, noiseSkeleton } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
const log = logger('nodes.noise');
const node: PlantNode = {
  title: 'Noise',
  type: 'noise',
  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
    size: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 20,
      step: 0.05,
      value: 1,
    },
    strength: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
  },

  computeSkeleton(parameters, ctx) {
    log(parameters);

    const { input } = parameters;

    const size = ctx.handleParameter(parameters.size);
    const strength = ctx.handleParameter(parameters.strength);

    const { stems } = input.result;


    stems.forEach((stem: PlantStem) => {
      noiseSkeleton(stem.skeleton, strength, size, [0, 0, 0], stem.depth === 0)
    });

    return {
      stems,
      allSkeletons: input.result.allSkeletons,
    };
  },

  computeGeometry(parameters) {
    return parameters.input.result;
  },
};

export default node;
