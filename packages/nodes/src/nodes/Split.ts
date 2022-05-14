import { join, splitSkeleton, tube } from '@plantarium/geometry';
import { typeCheckNode } from '../types';
export default typeCheckNode({
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
      min: 0,
      max: 1,
      step: 0.05,
      value: 0.7,
    },
    angle: {
      type: 'number',
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

  computeStem(parameters) {

    const height = parameters.height();
    const angle = parameters.angle();
    const amount = parameters.amount();

    const { stems: inputStems } = parameters.input();

    const maxDepth = Math.max(...inputStems.map(s => s.depth));

    const stems = inputStems.map((stem: PlantStem) => {
      if (stem.depth === maxDepth) {
        const newSkeletons = splitSkeleton(stem.skeleton, height, amount, angle);
        return newSkeletons.map((s, i) => {
          return {
            skeleton: s,
            id: stem.id,
            depth: stem.depth + (i === 0 ? 0 : 1),
          }
        })
      } else {
        return stem
      }
    }).flat().filter(v => !!v);

    console.log({ stems })

    return {
      stems,
    };
  },

});

