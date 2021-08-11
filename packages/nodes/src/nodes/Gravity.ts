import { rotate3D } from '@plantarium/geometry';
// import { logger } from '@plantarium/helpers';
import { Vec3 } from 'ogl';
import rotate2D from '@plantarium/geometry/src/helpers/rotate2D';

// const log = logger('node.gravity');

const node: PlantNode = {
  title: 'Gravity',
  type: 'gravity',

  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      external: true,
    },
    type: {
      internal: true,
      type: 'select',
      values: ['simple', 'verlet', 'test'],
    },
    strength: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 2,
      step: 0.05,
    },
  },
  computeNode(parameters) {
    return {
      type: 'gravity',
      parameters,
    };
  },
  computeSkeleton(node, ctx) {
    const { parameters } = node;
    const { input, type } = parameters;

    const {
      result: { skeletons },
    } = input;

    if (type === 'simple') {
      skeletons.forEach((skelly) => {
        const amount = skelly.length / 4;

        // Loop over every single joint in the skeleton
        for (let i = 1; i < amount; i++) {
          const a = i / amount;
          const y = skelly[i * 4 + 1];
          const strength = ctx.handleParameter(parameters?.strength, a);
          skelly[i * 4 + 1] = y - y * a * a * a * strength;
        }

        return skelly;
      });
    }

    if (type === 'test') {
      skeletons.forEach((skelly) => {
        const amount = skelly.length / 4;

        // Loop over every single joint in the skeleton
        for (let i = 1; i < amount; i++) {
          const a = i / amount;

          const strength = ctx.handleParameter(parameters.strength, a);

          //Current point at skeleton
          const x = skelly[i * 4 + 0];
          const y = skelly[i * 4 + 1];
          const z = skelly[i * 4 + 2];
          // const t = skelly[i * 4 + 2];

          const px = skelly[(i - 1) * 4 + 0];
          const py = skelly[(i - 1) * 4 + 1];
          const pz = skelly[(i - 1) * 4 + 2];

          //Current vector along skeleton
          const _vx = px - x;
          const vy = py - y;
          const _vz = py - z;

          //Rotate vector by 90 deg round the y axis
          const [vx, vz] = rotate2D(_vx, _vz, 90);

          for (let j = i; j < amount; j++) {
            //Current point at skeleton
            const _x = skelly[j * 4 + 0];
            const _y = skelly[j * 4 + 1];
            const _z = skelly[j * 4 + 2];

            //Subtract previous point from point;
            const ox = _x - px;
            const oy = _y - py;
            const oz = _z - pz;

            // Rotate around that vector

            // eslint-disable-next-line prefer-const
            let [rx, ry, rz] = rotate3D(
              [ox, oy, oz],
              [vx, vy, vz],
              strength * a,
            );

            // if (limit) {
            //   rx = ox > 0 ? Math.max(0, rx) : Math.min(0, rx);
            //   ry = ry + 0;
            //   rz = oz > 0 ? Math.max(0, rz) : Math.min(0, rz);
            // }

            //Move the point back
            const fx = rx + px;
            const fy = ry + py;
            const fz = rz + pz;

            skelly[j * 4 + 0] = fx;
            skelly[j * 4 + 1] = fy;
            skelly[j * 4 + 2] = fz;
          }
        }

        return skelly;
      });
    }

    if (type === 'verlet') {
      skeletons.forEach((skelly) => {
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

          const a = i / amount;

          const strength = ctx.handleParameter(parameters.strength, a);

          //Rotate all the other joints
          for (let j = i; j < amount; j++) {
            const rot = rotate3D([x, y, z], axis, a * strength);

            skelly[j * 4 + 0] = rot[0];
            skelly[j * 4 + 1] = rot[1];
            skelly[j * 4 + 2] = rot[2];
          }
        }

        return skelly;
      });
    }

    return {
      skeletons,
    };
  },
};

export default node;
