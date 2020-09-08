import { noise, arbitraryRotate } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { Vec3 } from 'ogl-typescript';

const log = logger('node.gravity');

const node: PlantNode = {
  name: 'Gravity',
  type: 'gravity',

  outputs: ['plant'],

  parameters: {
    input: {
      type: 'pd',
    },
  },
  computeNode(parameters) {
    return {
      type: 'gravity',
      parameters,
    };
  },
  computeSkeleton(part) {
    const { input, type } = part.parameters;
    const strength = 0.5;
    // const stemResY = settings.getSetting('stemResY');

    log(type, strength);

    const {
      result: { skeletons: inputSkeletons },
    } = input as SkeletonResult;

    if (type === 'simple') {
      const skeletons = inputSkeletons.map((skelly, j) => {
        const amount = skelly.length / 4;

        // Loop over every single joint in the skeleton
        for (let i = 1; i < amount; i++) {
          const x = skelly[i * 4 + 0];
          const y = skelly[i * 4 + 1];
          const z = skelly[i * 4 + 2];

          const origin = [skelly[0], skelly[1], skelly[2]];

          const a = i / amount;

          const gravityAngle = noise.n1d(j * 200) * strength * a;
          skelly[i * 4 + 0] =
            Math.cos(gravityAngle) * (x - origin[0]) -
            Math.sin(gravityAngle) * (y - origin[1]) +
            origin[0];
          skelly[i * 4 + 1] =
            Math.sin(gravityAngle) * (x - origin[0]) +
            Math.cos(gravityAngle) * (y - origin[1]) +
            origin[1];
          skelly[i * 4 + 2] = z;
        }

        return skelly;
      });

      return {
        skeletons,
      };
    }

    const skeletons = inputSkeletons.map((skelly) => {
      const amount = skelly.length / 4;

      // Loop over every single joint in the skeleton
      for (let i = 1; i < amount; i++) {
        const x = skelly[i * 4 + 0];
        const y = skelly[i * 4 + 1];
        const z = skelly[i * 4 + 2];

        const axis = new Vec3(5, 0, 0).cross(
          new Vec3(x, y, z),
          new Vec3(0, 1, 0),
        );

        //Rotate all the other joints
        for (let j = i; j < amount; j++) {
          const rot = arbitraryRotate([x, y, z], 0, axis);

          skelly[j * 4 + 0] = rot[0];
          skelly[j * 4 + 1] = rot[1];
          skelly[j * 4 + 2] = rot[2];
        }
      }

      return skelly;
    });

    return {
      skeletons,
    };
  },
};

export default node;
