import { interpolateSkeleton, join, tube } from '@plantarium/geometry';
import {
  interpolateSkeletonVec,
  normalize2D,
} from '@plantarium/geometry/src/helpers';
import rotate2D from '@plantarium/geometry/src/helpers/rotate2D';
import { typeCheckNode } from '../types';


export default typeCheckNode({
  title: 'Branches',
  type: 'branches',

  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
      required: true,
    },
    length: {
      type: 'number',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0.8,
    },
    thiccness: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
    },
    offsetSingle: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
    lowestBranch: {
      type: 'number',
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

  computeStem(parameters, ctx) {

    if (!parameters.input) return { stems: [] };

    const { stems: inputStems } = parameters.input();

    const branchRes = ctx.getSetting('stemResY');

    const maxDepth = Math.max(...inputStems.map(s => s.depth));

    const stems = inputStems
      .map((stem) => {
        const branches: Float32Array[] = [];

        if (maxDepth !== stem.depth) return []

        const amount = parameters.amount();

        const lowestBranch = parameters.lowestBranch();

        for (let i = 0; i < amount; i++) {
          const _a = i / amount;
          const length = parameters.length(_a) * (1 - _a);
          const thiccness = parameters.thiccness(_a);
          const offsetSingle = parameters.offsetSingle(_a);

          const isLeft = i % 2 === 0;
          let a = lowestBranch + (1 - lowestBranch) * _a;


          a = Math.min(a - (1 / amount) * offsetSingle * (isLeft ? -1 : 1), 1);

          //Vector along stem
          const [_vx, , _vz] = interpolateSkeletonVec(stem.skeleton, a);


          const nv = normalize2D([_vx, _vz]);


          //Rotate Vector along stem by 90deg
          const [vx, vz] = rotate2D(nv,
            isLeft ? -Math.PI / 2 : Math.PI / 2,
          );

          // Point along skeleton
          const [px, py, pz, pt] = interpolateSkeleton(stem.skeleton, a);

          const pointAmount = Math.max(Math.floor(branchRes), 4);

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

        return branches.map(b => {
          return {
            skeleton: b,
            id: stem.id,
            depth: stem.depth + 1
          }
        });
      })
      .flat();

    return {
      stems: [...inputStems, ...stems]
    };
  },
});

