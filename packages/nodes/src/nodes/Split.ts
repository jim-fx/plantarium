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

    const { stems } = input.result as { stems: PlantStem[] };

    const maxDepth = Math.max(...stems.map(s => s.depth));

    const results = stems.map((stem: PlantStem) => {
      if (stem.depth === maxDepth) {
        const newSkeletons = splitSkeleton(stem.skeleton, height, amount, angle);
        return newSkeletons.map(s => {
          return {
            skeleton: s,
            depth: stem.depth + 1,
          }
        })
      }
    }).flat().filter(v => !!v);

    return {
      stems: results,
      allSkeletons: [...input.result.allSkeletons, ...results],
    };
  },

  computeGeometry(_, result, ctx) {
    const stemResX = ctx.getSetting('stemResX');

    const { stems } = result;

    return {
      geometry: join(
        // geometry,
        ...stems.map(({ skeleton }) => tube(skeleton, stemResX)),
      ),
    };
  },
};

export default node;
