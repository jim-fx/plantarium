import { noise } from 'helpers';
import { PlantariumSettings } from '@plantarium/types';

export function skeleton(part: PlantPart, settings: PlantariumSettings) {
  const { parameters } = part;

  const { input, size = 1, strength = 0.5 } = parameters;

  const { skeletons: inputSkeletons } = input.result;

  inputSkeletons.forEach((skelly, j) => {
    const length = skelly.length / 4;

    const lastVec = [skelly[0], skelly[1], skelly[2]];
    let distance = 0;

    for (let i = 0; i < length; i++) {
      const a = i / length;

      distance +=
        (Math.abs(lastVec[0] - skelly[i * 4 + 0]) +
          Math.abs(lastVec[1] - skelly[i * 4 + 1]) +
          Math.abs(lastVec[2] - skelly[i * 4 + 2])) /
        3;

      lastVec[0] = skelly[i * 4 + 0];
      lastVec[1] = skelly[i * 4 + 1];
      lastVec[2] = skelly[i * 4 + 2];

      skelly[i * 4 + 0] =
        skelly[i * 4 + 0] +
        noise.n1d(distance * size + 0 + j * 500) * strength * a;
      skelly[i * 4 + 1] =
        skelly[i * 4 + 1] +
        noise.n1d(distance * size + 1000 + j * 500) * strength * a;
      skelly[i * 4 + 2] =
        skelly[i * 4 + 2] +
        noise.n1d(distance * size + 2000 + j * 500) * strength * a;
    }
  });

  return {
    skeletons: inputSkeletons,
  };
}
