import { interpolateSkeleton, join } from 'helpers';
import { PlantariumSettings } from '@plantarium/types';
import tube from 'shapes/tube';

export function geometry(part: PlantPart, settings: PlantariumSettings) {
  const { stemResX = 3 } = settings;
  const {
    parameters: { input },
    result: { skeletons },
  } = part;

  return {
    geometry: join(
      input.result.geometry,
      ...skeletons.map((skeleton) => {
        return tube(skeleton, stemResX);
      }),
    ),
  };
}

export function skeleton(part: PlantPart, settings: PlantariumSettings) {
  const { parameters } = part;

  const {
    input,
    length,
    amount,
    thiccness = 0.2,
    lowestBranch = 0.5,
  } = parameters;

  const skeletons: Float32Array[] = [];
  const { skeletons: inputSkeletons } = input.result;

  for (let s = 0; s < inputSkeletons.length; s++) {
    const skelly = inputSkeletons[s];

    for (let i = 0; i < amount; i++) {
      const a = i / amount;
      const [x, y, z, t] = interpolateSkeleton(
        skelly,
        lowestBranch + a * lowestBranch,
      );

      console.log('BRANCH', x, y, z);

      skeletons.push(
        Float32Array.from([
          x,
          y,
          z,
          t * thiccness,
          x + length,
          y,
          z,
          t * thiccness,
        ]),
      );
    }
  }

  return {
    skeletons,
  };
}
