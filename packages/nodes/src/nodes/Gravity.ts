import { add3D, distance3D, interpolateSkeleton, length3D, lerp3D, multiply3D, rotate2D, rotate3D, subtract3D } from '@plantarium/geometry';
// import { logger } from '@plantarium/helpers';
import { PlantStem } from '@plantarium/types';
import { Vec3 } from 'ogl-typescript';
import { typeCheckNode } from '../types';

// const log = logger('node.gravity');

export default typeCheckNode({
  title: 'Gravity',
  type: 'gravity',

  outputs: ['plant'],

  meta: {
    description: `The gravity node applies simple gravity to branches and stems.`
  },

  parameters: {
    input: {
      type: 'plant',
      required: true,
      external: true,
    },
    curviness: {
      hidden: true,
      type: "number",
      inputType: "float",
      value: 1,
    },
    type: {
      internal: true,
      hidden: true,
      type: 'select',
      values: ['default', "simple", 'verlet', 'test'],
      value: "default",
      description: "How the gravity should be calculated, right now only simple and test work."
    },
    strength: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.05,
      value: 1
    },
  },
  compute(parameters) {
    const { input, type, strength } = parameters;

    const { stems, instances } = input();

    const maxDepth = Math.max(...stems.map(s => s.depth));

    if (type === 'simple') {
      stems.forEach(({ skeleton: skelly, depth }: PlantStem, j) => {
        if (depth !== maxDepth) return;
        const amount = skelly.length / 4;

        // Loop over every single joint in the skeleton
        const _strength = strength(j / stems.length);

        for (let i = 1; i < amount; i++) {
          const a = i / amount;
          const y = skelly[i * 4 + 1];
          skelly[i * 4 + 1] = y - y * a * a * a * _strength;
        }

        return skelly;
      });
    }

    if (type === "default") {
      for (const stem of stems) {
        if (stem.depth !== maxDepth) continue;

        const skeleton = stem.skeleton;

        let offsetVec = [0, 0, 0];
        const amountPoints = skeleton.length / 4;

        const outArray = skeleton.slice(0, skeleton.length)

        for (let i = 1; i < amountPoints; i++) {

          const startIndex = (i - 1) * 4;
          const endIndex = startIndex + 4;

          const startPoint = skeleton.slice(startIndex, endIndex)
          const endPoint = skeleton.slice(endIndex, endIndex + 4) as unknown as number[]
          const length = distance3D(startPoint, endPoint);

          const normalizedEndpoint = subtract3D(endPoint, startPoint);

          const _alpha = (i + 1) / (amountPoints);
          const strength = (parameters.strength(_alpha) / Math.max(parameters.curviness(_alpha), 0.0001)) * parameters.strength(_alpha);
          const downPoint = [0, -length * strength, 0];

          let midPoint = lerp3D(normalizedEndpoint, downPoint, parameters.curviness(_alpha) * Math.sqrt(i / amountPoints));

          if (midPoint[0] === 0 && midPoint[2] === 0) {
            midPoint[0] += 0.0001;
            midPoint[2] += 0.0001;
          }

          // Correct size of midpoint vec
          midPoint = multiply3D(midPoint, length / length3D(midPoint));

          const finalEndPoint = add3D(startPoint, midPoint);
          const offsetEndPoint = add3D(endPoint, offsetVec);

          outArray[endIndex + 0] = offsetEndPoint[0];
          outArray[endIndex + 1] = offsetEndPoint[1];
          outArray[endIndex + 2] = offsetEndPoint[2];

          const offset = subtract3D(finalEndPoint, endPoint);

          offsetVec = add3D(offsetVec, offset);

        }


        stem.skeleton = outArray;
      }
    }

    if (type === 'test') {
      stems.forEach(({ skeleton: skelly, depth }: PlantStem) => {

        if (depth !== maxDepth) return;
        const amount = skelly.length / 4;

        // Loop over every single joint in the skeleton
        for (let i = 1; i < amount; i++) {
          const a = i / amount;

          const _strength = strength(a);

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
          const [vx, vz] = rotate2D([_vx, _vz], Math.PI / 2);

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
              _strength * a,
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
      stems.forEach(({ skeleton: skelly }: PlantStem) => {
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

          const _strength = strength(a);

          //Rotate all the other joints
          for (let j = i; j < amount; j++) {
            const rot = rotate3D([x, y, z], axis, a * _strength);

            skelly[j * 4 + 0] = rot[0];
            skelly[j * 4 + 1] = rot[1];
            skelly[j * 4 + 2] = rot[2];
          }
        }

        return skelly;
      });
    }

    // Correct instances on the changed stems
    if (instances) {
      instances.forEach((inst, i) => {
        if (inst.depth === maxDepth) {
          const stem = stems[i];
          const amount = inst.offset.length / 3;
          for (let j = 0; j < amount; j++) {
            const p = interpolateSkeleton(stem.skeleton, inst.baseAlpha[j]);
            if (p) {
              inst.offset[j * 3 + 0] = p[0];
              inst.offset[j * 3 + 1] = p[1];
              inst.offset[j * 3 + 2] = p[2];
            }
          }
        }
      })
    }

    return {
      stems,
      instances,
    };
  },
});

