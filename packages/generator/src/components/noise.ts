import { PlantariumSettings } from '@plantarium/types';
import { noise } from 'helpers';

export const skeleton = (part: PlantPart, settings: PlantariumSettings) => {
  console.log('skeleton.noise', part);

  const {
    scale = 1,
    strength = 4,
    input: { skeletons: inputSkeletons },
  } = part.parameters;

  const skeletons = inputSkeletons.map((skelly, j) => {
    const amount = skelly.length / 4;
    for (let i = 0; i < amount; i++) {
      const alpha = i / amount;
      skelly[i * 4 + 0] =
        skelly[i * 4 + 0] +
        noise.n2d(alpha * scale, j * 2000 + 1000) * strength;
      skelly[i * 4 + 1] =
        skelly[i * 4 + 1] +
        noise.n2d(alpha * scale, j * 2000 + 5000) * strength;
      skelly[i * 4 + 2] =
        skelly[i * 4 + 2] +
        noise.n2d(alpha * scale, j * 2000 + 9000) * strength;
    }

    return skelly;
  });

  return skeletons;
};
