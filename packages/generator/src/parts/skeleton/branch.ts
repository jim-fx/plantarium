import { noise, interpolateArray, interpolateSkeleton } from 'helpers';
import { Vec3 } from 'ogl';
import { PlantariumSettings } from '@plantarium/types';
import arbitraryRotate from 'helpers/arbitraryRotate';
import createSkeletonPart from '../createSkeletonPart';

export default function createBranchSkeleton(
  parameters,
  settings: PlantariumSettings,
) {
  console.log('skeleton.branch');

  if (!parameters.input) return;
  parameters.input = createSkeletonPart(parameters.input, settings);
  const {
    length,
    amount,
    input,
    thiccness = 0.2,
    lowestBranch = 0.5,
  } = parameters;

  const skeletons: Float32Array[] = [];
  const { skeletons: inputSkeletons } = parameters.input;

  for (let s = 0; s < skeletons.length; s++) {
    const skelly = inputSkeletons[s];

    for (let i = 0; i < amount; i++) {
      const a = i / amount;
      const [x, y, z] = interpolateSkeleton(
        skelly,
        lowestBranch + a * lowestBranch,
      );

      skeletons.push(
        Float32Array.from([x, y, z, thiccness, x + length, y, z, thiccness]),
      );
    }
  }

  return {
    type: 'branch',
    parameters,
    skeletons,
  };
}
