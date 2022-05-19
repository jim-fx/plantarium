import { rotate3D } from '@plantarium/geometry';
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
      value: "x"
    },
    spread: {
      internal: true,
      type: 'boolean',
      value: true,
    },
    angle: {
      type: 'number',
      min: 0,
      max: Math.PI * 2,
      step: 0.05,
      value: 0,
    },
  },
  computeStem(parameters) {

    const { input, axis, spread, } = parameters;

    const inp = input();

    const stems = inp.stems;

    const rotationAxis = getRotationAxis(axis);

    const { depth: maxDepth } = stems[stems.length - 1];

    stems.forEach((stem: PlantStem, j: number) => {

      if (stem.depth !== maxDepth) return;


      const skelly = stem.skeleton;
      const amount = stem.skeleton.length / 4;

      // const a = j / skeletons.length;

      const ox = skelly[0];
      const oy = skelly[1];
      const oz = skelly[2];

      const _a = j / stems.length;

      const angle = parameters.angle(_a) * (spread ? _a : 1);

      // Loop over every single joint in the skeleton
      for (let i = 1; i < amount; i++) {
        //Current point at skeleton
        let x = skelly[i * 4 + 0];
        let y = skelly[i * 4 + 1];
        let z = skelly[i * 4 + 2];

        //Subtract origin from point;
        x -= ox;
        y -= oy;
        z -= oz;

        //Rotate around axis
        [x, y, z] = rotate3D([x, y, z], rotationAxis, angle);

        //Move the point back
        x += ox;
        y += oy;
        z += oz;

        skelly[i * 4 + 0] = x;
        skelly[i * 4 + 1] = y;
        skelly[i * 4 + 2] = z;
      }
    });

    return {
      ...inp,
      stems,
    };
  },
});

