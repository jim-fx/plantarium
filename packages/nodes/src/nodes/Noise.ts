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

    const { skeletons } = input.result;

    console.log({ skeletons })

    skeletons.forEach((skelly: Float32Array, j: number) => {
      noiseSkeleton(skelly, strength, size, [0, 0, 0], j === 0)
    });

    return {
      skeletons,
      allSkeletons: input.result.allSkeletons,
    };
  },

  computeGeometry(parameters) {
    return parameters.input.result;
  },
};

export default node;
