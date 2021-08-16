import { join, tube } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
const log = logger('nodes.leaf');

const defaultValue = [
  {
    x: 1,
    y: 1,
    pinned: true,
  },
  {
    x: 0.62,
    y: 0.84,
    pinned: false,
  },
  {
    x: 0.54,
    y: 0.63,
    pinned: false,
  },
  {
    x: 0.38,
    y: 0.41,
    pinned: true,
  },
  {
    x: 0.44,
    y: 0.23,
    pinned: false,
  },
  {
    x: 0.64,
    y: 0.12,
    pinned: false,
  },
  {
    x: 0.98,
    y: 0.02,
    pinned: true,
  },
];

const node: PlantNode = {
  title: 'Leaf',
  type: 'leaf',
  outputs: ['plant'],
  parameters: {
    input: {
      type: 'plant',
      external: true,
    },
    size: {
      type: ['number', 'parameter', 'curve', 'vec2'],
      inputType: 'slider',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0,
    },
    shape: {
      type: 'leaf',
      external: true,
      defaultValue,
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 1,
    },
  },

  computeSkeleton(parameters, ctx) {
    const amount = ctx.handleParameter(parameters.amount);

    const amountPoints = ctx.getSetting('stemResY');

    const skeletons = [];

    for (let i = 0; i < amount; i++) {
      const ox = ctx.handleParameter(parameters.origin?.x);
      const oy = ctx.handleParameter(parameters.origin?.y);
      const oz = ctx.handleParameter(parameters.origin?.z);

      const height = ctx.handleParameter(parameters.height);

      const skeleton = new Float32Array(amountPoints * 4);

      const thiccness = ctx.handleParameter(parameters.thiccness, i / amount);

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

  computeGeometry(parameters, result, ctx) {
    const { plant } = parameters;
    const stemResX = ctx.getSetting('stemResX');
    return {
      geometry: join(
        plant.result.geometry,
        ...result.skeletons.map((skelly) => tube(skelly, stemResX)),
      ),
    };
  },
};

export default node;
