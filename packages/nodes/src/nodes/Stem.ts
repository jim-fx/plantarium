import { join, tube } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
const log = logger('nodes.stem');

const node: PlantNode = {
  title: 'Stem',
  type: 'stem',
  outputs: ['plant'],
  parameters: {
    origin: {
      type: 'vec3',
      external: true,
      defaultValue: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    height: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 5,
      step: 0.05,
      value: 2,
    },
    thiccness: {
      type: 'number',
      inputType: 'slider',
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

  computeSkeleton(parameters, ctx) {
    log('computeSkeleton', parameters);

    const amount = ctx.handleParameter(parameters.amount);

    const amountPoints = ctx.getSetting('stemResY');

    const skeletons = [];

    for (let i = 0; i < amount; i++) {
      const { x: ox, y: oy, z: oz } = ctx.handleParameter(parameters.origin);

      const height = ctx.handleParameter(parameters.height);

      const skeleton = new Float32Array(amountPoints * 4);

      for (let j = 0; j < amountPoints; j++) {
        const a = j / amountPoints;
        const thiccness =
          ctx.handleParameter(parameters.thiccness, a) * (1 - a);

        //Create point
        const x = ox;
        const y = oy + a * height;
        const z = oz;

        skeleton[j * 4 + 0] = x;
        skeleton[j * 4 + 1] = y;
        skeleton[j * 4 + 2] = z;
        skeleton[j * 4 + 3] = thiccness;
      }

      skeletons.push(skeleton);
    }

    return {
      skeletons,
      allSkeletons: skeletons,
    };
  },

  computeGeometry(parameters, result, ctx) {
    log('computeNode', parameters, result);
    const stemResX = ctx.getSetting('stemResX');
    return {
      geometry: join(
        ...result.skeletons.map((skelly) => tube(skelly, stemResX)),
      ),
    };
  },
};

export default node;
