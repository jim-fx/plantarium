import { interpolateSkeleton, join } from 'helpers';
import { PlantariumSettings } from '@plantarium/types';
import tube from 'shapes/tube';

export function geometry(part: PlantPart, settings: PlantariumSettings) {
  const { stemResX = 3 } = settings;
  const {
    parameters: { input },
    result: { skeletons },
  } = part;

  console.log(input.result.geometry, skeletons, stemResX);

  return {
    geometry: join(
      input.result.geometry,
      ...skeletons.map((skeleton) => tube(skeleton, stemResX)),
    ),
  };
}

const branchRes = 50;

export function skeleton(part: PlantPart, settings: PlantariumSettings) {
  const { parameters } = part;

  const {
    input,
    length = 1,
    amount,
    thiccness = 0.2,
    lowestBranch = 0.5,
  } = parameters;

  const { skeletons: inputSkeletons } = input.result;

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
}
