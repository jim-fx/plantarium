import { interpolateSkeleton, join, tube } from '@plantarium/geometry';
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
    offsetSingle: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
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
      value: 10,
    },
  },

  computeSkeleton(parameters, ctx) {
    const { skeletons: inputSkeletons } = parameters.input.result;

    const branchRes = ctx.getSetting('stemResY');

    const skeletons = inputSkeletons
      .map((skelly) => {
        const branches: Float32Array[] = [];

        const amount = ctx.handleParameter(parameters.amount);

        const lowestBranch = ctx.handleParameter(parameters.lowestBranch);

        for (let i = 0; i < amount; i++) {
          const _a = i / amount;
          const length = ctx.handleParameter(parameters.length, _a) * (1 - _a);
          const thiccness = ctx.handleParameter(parameters.thiccness, _a);
          const offsetSingle = ctx.handleParameter(parameters.offsetSingle, _a);

          const isLeft = i % 2 === 0;
          let a = lowestBranch + (1 - lowestBranch) * _a;

          a -= (1 / amount) * offsetSingle * (isLeft ? -1 : 1);

          //Vector along stem
          const [_vx, , _vz] = interpolateSkeletonVec(skelly, a);

          const nv = normalize2D([_vx, _vz]);

          //Rotate Vector along stem by 90deg
          const [vx, vz] = rotate2D(
            nv[0],
            nv[1],
            isLeft ? -Math.PI / 2 : Math.PI / 2,
          );

          // Point along skeleton
          const [px, py, pz, pt] = interpolateSkeleton(skelly, a);

          const pointAmount = Math.max(Math.floor(branchRes * length * 10), 4);

          const branch = new Float32Array(pointAmount * 4);
          for (let j = 0; j < pointAmount * 4; j++) {
            const _a = j / pointAmount;

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
      allSkeletons: [...skeletons, ...inputSkeletons],
    };
  },

  computeGeometry(parameters, result, ctx) {
    const stemResX = ctx.getSetting('stemResX');

    const { geometry } = parameters.input.result;
    const { skeletons } = result;

    return {
      geometry: join(
        geometry,
        ...skeletons.map((skeleton) => tube(skeleton, stemResX)),
      ),
    };
  },
};

export default node;
