import { rotate3D, rotateSkeleton } from '@plantarium/geometry';
import { PlantStem } from '@plantarium/types';
import { typeCheckNode } from '../types';

const getRotationAxis = (mode: string) => {
  if (mode === 'x') return [1, 0, 0];
  if (mode === 'z') return [0, 0, 1];
  return [0, 1, 0];
};

export default typeCheckNode({
  title: 'Rotate',

  type: 'rotate',

  outputs: ['plant'],

  meta: {
    description: `The rotate node rotates a plant around a specified axis by a specified amount.`
  },

  parameters: {
    input: {
      type: 'plant',
      required: true,
      external: true,
    },
    axis: {
      type: 'select',
      internal: true,
      label: false,
      inputType: "tab",
      values: ['x', 'y', 'z'],
      value: "x",
      description: "Along which axis should we rotate?"
    },
    aroundOrigin: {
      type: 'boolean',
      hidden: true,
      value: false,
      description: "Rotate around 0,0,0"
    },
    smooth: {
      type: "boolean",
      hidden: true,
      value: false,
    },
    spread: {
      internal: true,
      type: 'boolean',
      value: true,
      description: "If multiple objects are connected, should we rotate them as one or spread them?"
    },
    angle: {
      type: 'number',
      min: 0,
      max: Math.PI * 2,
      step: 0.05,
      value: 0,
      description: "Rotation angle"
    },
  },
  compute(parameters) {

    const { input, axis, spread, } = parameters;

    const inp = input();

    const stems = inp.stems;

    const rotationAxis = getRotationAxis(axis);

    const { depth: maxDepth } = stems[stems.length - 1];

    stems.forEach((stem: PlantStem, j: number) => {

      if (stem.depth !== maxDepth) return;

      const _a = j / stems.length;

      const angle = parameters.angle(_a) * (spread ? _a : 1);

      const skelly = stem.skeleton;

      let ox = skelly[0];
      let oy = skelly[1];
      let oz = skelly[2];


      if (parameters.aroundOrigin()) {
        ox = 0;
        oy = 0;
        oz = 0;
      }
      console.log([ox, oy, oz])

      rotateSkeleton(stem.skeleton, rotationAxis, angle, [ox, oy, oz], parameters.smooth());

    });

    return {
      ...inp,
      stems,
    };
  },
});

