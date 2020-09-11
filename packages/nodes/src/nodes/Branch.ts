import { join, tube, interpolateSkeleton } from '@plantarium/geometry';
import { GeometryResult, PlantNode } from '@types';

const branchRes = 50;

const node: PlantNode = {
  title: 'Branches',
  type: 'branch',

  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      internal: false,
    },
    length: {
      type: ['number', 'parameter', 'curve'],
      inputType: 'slider',
      min: 0,
      max: 10,
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
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 1,
    },
  },

  computeNode(parameters) {
    return {
      type: 'branch',
      parameters,
    };
  },

  computeSkeleton(part) {
    const { parameters } = part;

    const { input } = parameters;

    const length = 1;
    const amount = 2;
    const thiccness = 0.2;
    const lowestBranch = 0.5;

    const { skeletons: inputSkeletons } = (input as GeometryResult).result;

    const skeletons: Float32Array[] = inputSkeletons
      .map((skelly) => {
        const branches = [];
        for (let i = 0; i < amount; i++) {
          const a = i / amount;

          const ci = Math.floor((skelly.length / 4) * a);

          const [x, y, z, t] = interpolateSkeleton(
            skelly,
            lowestBranch + a * lowestBranch,
          );

          const branch = new Float32Array(branchRes * 4);
          for (let j = 0; j < branchRes * 4; j++) {
            const _a = j / branchRes;

            branch[j * 4 + 0] = x + _a * length;
            branch[j * 4 + 1] = y;
            branch[j * 4 + 2] = z;
            branch[j * 4 + 3] = t * thiccness * (1 - _a);
          }

          branches.push(branch);
        }

        return branches;
      })
      .flat();

    console.log('BRANCH', skeletons);

    return {
      skeletons,
    };
  },

  computeGeometry(part, ctx) {
    const stemResX = ctx.getSetting('stemResX');
    const {
      parameters: { input },
      result: { skeletons },
    } = part;

    return {
      geometry: join(
        (input as GeometryResult).result.geometry,
        ...skeletons.map((skeleton) => tube(skeleton, stemResX)),
      ),
    };
  },
};

export default node;
