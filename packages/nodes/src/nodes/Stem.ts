import { join, tube } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { typeCheckNode } from '../types';
const log = logger('nodes.stem');

export default typeCheckNode({
  title: 'Stem',
  type: 'stem',
  outputs: ['plant'],
  parameters: {
    origin: {
      type: 'vec3',
      external: true,
      value: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    height: {
      type: 'number',
      min: 0,
      max: 5,
      step: 0.05,
      value: 2,
    },
    thiccness: {
      type: 'number',
      min: 0,
      max: 0.2,
      step: 0.01,
      value: 0.06,
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 1,
    },
  },

  computeStem(parameters, ctx) {
    log('computeSkeleton', parameters);

    const amount = parameters.amount();

    const amountPoints = ctx.getSetting('stemResY');

    const stems: PlantStem[] = [];

    for (let i = 0; i < amount; i++) {
      const { x: ox, y: oy, z: oz } = parameters.origin(i);

      const height = parameters.height();

      const skeleton = new Float32Array(amountPoints * 4);

      for (let j = 0; j < amountPoints; j++) {
        const a = j / amountPoints;
        const thiccness = parameters.thiccness(a) * (1 - a);

        //Create point
        const x = ox;
        const y = oy + a * height;
        const z = oz;

        skeleton[j * 4 + 0] = x;
        skeleton[j * 4 + 1] = y;
        skeleton[j * 4 + 2] = z;
        skeleton[j * 4 + 3] = thiccness;
      }

      stems.push({ depth: 0, skeleton, id: "stem" + ctx.getId() });
    }

    return {
      stems
    };
  },

});

