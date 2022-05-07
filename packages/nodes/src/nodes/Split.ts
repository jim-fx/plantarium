import { join, splitSkeleton, tube } from '@plantarium/geometry';
const node: PlantNode = {
  title: 'Split',
  type: 'split',
  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
    height: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 20,
      step: 0.05,
      value: 1,
    },
    angle: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
    amount: {
      type: 'number',
      min: 2,
      max: 20,
      value: 2,
    },
  },

  computeSkeleton(parameters, ctx) {

    const { input } = parameters;

    const height = ctx.handleParameter(parameters.height);
    const angle = ctx.handleParameter(parameters.angle);
    const amount = ctx.handleParameter(parameters.amount);

    const { skeletons } = input.result;

    const results = []

    skeletons.forEach((skelly: Float32Array) => {
      results.push(...splitSkeleton(skelly, height, amount, angle))
    });

    return {
      skeletons: results,
      allSkeletons: [...input.result.allSkeletons, ...results],
    };
  },

  computeGeometry(_, result, ctx) {
    const stemResX = ctx.getSetting('stemResX');

    const { skeletons } = result;

    return {
      geometry: join(
        // geometry,
        ...skeletons.map((skeleton) => tube(skeleton, stemResX)),
      ),
    };
  },
};

export default node;
