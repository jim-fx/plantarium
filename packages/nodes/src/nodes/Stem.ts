import { join, tube } from '@plantarium/geometry';
import { PlantNode } from '@plantarium/types';

const node: PlantNode = {
  title: 'Stem',
  type: 'stem',
  outputs: ['plant'],
  parameters: {
    origin: {
      type: 'vec3',
      internal: false,
    },
    height: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 5,
      step: 0.05,
      value: 0,
    },
    thiccness: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 0.2,
      step: 0.01,
      value: 0,
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 1,
    },
  },
  computeNode(parameters) {
    return {
      type: 'stem',
      parameters,
    };
  },

  computeSkeleton(part, ctx) {
    // const {} = part.parameters;

    const origin = { x: 0, y: 0, z: 0 };
    const height = 3;
    const thiccness = 0.4;
    const amount = 1;

    // const { stemResY: amountPoints = 50 } = settings;

    const amountPoints = ctx.getSetting('stemResY', 50);

    console.log(amountPoints);

    const skeletons = [];

    for (let i = 0; i < amount; i++) {
      const skeleton = new Float32Array(amountPoints * 4);

      for (let j = 0; j < amountPoints; j++) {
        const a = j / amountPoints;

        //Create point
        const x = origin.x;
        const y = origin.z + a * height;
        const z = origin.y;

        skeleton[j * 4 + 0] = x;
        skeleton[j * 4 + 1] = y;
        skeleton[j * 4 + 2] = z;
        skeleton[j * 4 + 3] = (1 - a) * thiccness;
      }

      skeletons.push(skeleton);
    }

    return {
      skeletons,
    };
  },

  computeGeometry(part, ctx) {
    const stemResX = ctx.getSetting('stemResX');

    return {
      geometry: join(
        ...part.result.skeletons.map((skelly) => tube(skelly, stemResX)),
      ),
    };
  },
};

export default node;
