import { splitSkeleton } from '@plantarium/geometry';
import { PlantStem } from '@plantarium/types';
import { filterInstancesByAlpha } from '../helpers';
import { typeCheckNode } from '../types';
export default typeCheckNode({
  title: 'Split',
  type: 'split',
  outputs: ['plant'],

  meta: {
    description: `The split node splits the input plant at a specified height resulting in new branches.`
  },

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      required: true,
      external: true,
    },
    height: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.05,
      value: 0.7,
      description: "Where along the input stem do we split"
    },
    angle: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
      description: "What angle in reference to the input stem should the split branches have."
    },
    amount: {
      type: 'number',
      min: 2,
      max: 20,
      value: 2,
      description: "Into how many branches should we split"
    },
  },

  computeStem(parameters) {

    const height = parameters.height();
    const angle = parameters.angle();
    const amount = parameters.amount();

    const input = parameters.input();

    const maxDepth = Math.max(...input.stems.map(s => s.depth));

    const stems = input.stems.map((stem: PlantStem) => {
      if (stem.depth === maxDepth) {
        const newSkeletons = splitSkeleton(stem.skeleton, height, amount, angle);
        return newSkeletons.map((s, i) => {
          return {
            skeleton: s,
            id: stem.id,
            baseAlpha: height,
            depth: stem.depth + (i === 0 ? 0 : 1),
          }
        })
      } else {
        return stem
      }
    }).flat().filter(v => !!v);


    if (input.instances) {
      input.instances = filterInstancesByAlpha(input.instances, 0, height, maxDepth);
    }

    return {
      stems,
      instances: input.instances
    };
  },

});

