import { join, tube } from 'packages/geometry';

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
  computeNode(parameters) {
    return {
      type: 'stem',
      parameters,
    };
  },

  computeSkeleton(part, ctx) {
    const amount = ctx.handleParameter(part.parameters.amount);

    const amountPoints = 50; //} = ctx.settings;

    const skeletons = [];

    for (let i = 0; i < amount; i++) {
      const ox = ctx.handleParameter(part.parameters.origin?.x);
      const oy = ctx.handleParameter(part.parameters.origin?.y);
      const oz = ctx.handleParameter(part.parameters.origin?.z);

      const height = ctx.handleParameter(part.parameters.height);
      const thiccness = ctx.handleParameter(part.parameters.thiccness);

      const skeleton = new Float32Array(amountPoints * 4);

      for (let j = 0; j < amountPoints; j++) {
        const a = j / amountPoints;

        //Create point
        const x = ox;
        const y = oy + a * height;
        const z = oz;

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
    const stemResX = 16;
    return {
      geometry: join(
        ...part.result.skeletons.map((skelly) => tube(skelly, stemResX)),
      ),
    };
  },
};

export default node;
