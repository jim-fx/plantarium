import { join, tube, interpolateSkeleton } from '@plantarium/geometry';
import {
  interpolateSkeletonVec,
  normalize2D,
} from '@plantarium/geometry/src/helpers';
import rotate2D from '@plantarium/geometry/src/helpers/rotate2D';

const node: PlantNode = {
  title: 'Branches',
  type: 'branch',

  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
    length: {
      type: ['number', 'parameter', 'curve'],
      inputType: 'slider',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0,
    },
    thiccness: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
    lowestBranch: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.2,
    },
    amount: {
      type: 'number',
      min: 0,
      max: 64,
      value: 1,
    },
  },

  computeNode(parameters) {
    return {
      type: 'branch',
      parameters,
    };
  },

  computeSkeleton(part, ctx) {
    const { parameters } = part;

    const { input } = parameters;

    const { skeletons: inputSkeletons } = input.result;

    const branchRes = ctx.getSetting('stemResX');

    const skeletons = inputSkeletons
      .map((skelly) => {
        const branches: Float32Array[] = [];

        const amount = ctx.handleParameter(parameters.amount);

        const lowestBranch = ctx.handleParameter(parameters.lowestBranch);

        for (let i = 0; i < amount; i++) {
          const _a = i / amount;
          const length = ctx.handleParameter(parameters.length, _a);
          const thiccness = ctx.handleParameter(parameters.thiccness, _a);

          const a = lowestBranch + (1 - lowestBranch) * _a;
          const isLeft = i % 2 === 0;

          //Vector along stem
          const [_vx, _vy, _vz] = interpolateSkeletonVec(skelly, a);

          const nv = normalize2D([_vx, _vz]);

          //Rotate Vector along stem by 90deg
          const [vx, vz] = rotate2D(nv[0], nv[1], isLeft ? 90 : -90);

          // Point along skeleton
          const [px, py, pz, pt] = interpolateSkeleton(skelly, a);

          const branch = new Float32Array(branchRes * 4);
          for (let j = 0; j < branchRes * 4; j++) {
            const _a = j / branchRes;

            branch[j * 4 + 0] = px + vx * _a * length;
            branch[j * 4 + 1] = py;
            branch[j * 4 + 2] = pz + vz * _a * length;
            branch[j * 4 + 3] = pt * thiccness * (1 - _a);
          }

          branches.push(branch);
        }

        return branches;
      })
      .flat();

    return {
      skeletons,
    };
  },

  computeGeometry(part) {
    const stemResX = 16;
    const {
      parameters: { input },
      result: { skeletons },
    } = part;

    return {
      geometry: join(
        input.result.geometry,
        ...skeletons.map((skeleton) => tube(skeleton, stemResX)),
      ),
    };
  },
};

export default node;
