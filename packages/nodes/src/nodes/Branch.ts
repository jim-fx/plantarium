import { interpolateSkeleton } from '@plantarium/geometry';
import { findMaxDepth } from "../helpers"
import {
  interpolateSkeletonVec,
  normalize2D,
} from '@plantarium/geometry/src/helpers';
import rotate2D from '@plantarium/geometry/src/helpers/rotate2D';
import { PlantStem } from '@plantarium/types';
import { typeCheckNode } from '../types';


export default typeCheckNode({
  title: 'Branches',
  type: 'branches',

  outputs: ['plant'],

  meta: {
    description: `The branch node places branches along the input stem, resulting in new branches.`
  },

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
      hidden: true,
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
    highestBranch: {
      type: 'number',
      hidden: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
    },
    depth: {
      type: 'number',
      hidden: true,
      min: 1,
      value: 1,
      description: "On how many layern of branches should we place branches."
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

    const input = parameters.input();

    const branchRes = ctx.getSetting('stemResY');

    const maxDepth = findMaxDepth(input);

    const stems = input.stems
      .map((stem, j) => {
        const branches: PlantStem[] = [];

        if (stem.depth < (maxDepth - parameters.depth() + 1)) return []

        const amount = parameters.amount();

        const lowestBranch = parameters.lowestBranch(j);
        const highestBranch = parameters.highestBranch(j)

        for (let i = 0; i < amount; i++) {
          const _a = i / amount;
          const length = parameters.length(_a) * (1 - _a);
          const thiccness = parameters.thiccness(_a);
          const offsetSingle = parameters.offsetSingle(_a);

          const isLeft = i % 2 === 0;
          let a = lowestBranch + (highestBranch - lowestBranch) * _a;


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

          const branchSkeleton = new Float32Array(pointAmount * 4);
          for (let j = 0; j < pointAmount * 4; j++) {
            const _a = j / pointAmount;

            branchSkeleton[j * 4 + 0] = px + vx * _a * length;
            branchSkeleton[j * 4 + 1] = py;
            branchSkeleton[j * 4 + 2] = pz + vz * _a * length;
            branchSkeleton[j * 4 + 3] = pt * thiccness * (1 - _a);
          }

          branches.push({
            skeleton: branchSkeleton,
            id: stem.id + "-" + i,
            baseAlpha: a,
            depth: stem.depth + 1
          });
        }

        return branches
      })
      .flat();

    return {
      instances: input.instances,
      stems: [...input.stems, ...stems]
    };
  },
});

