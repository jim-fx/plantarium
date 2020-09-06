import { tube } from 'shapes';
import { PlantariumSettings } from '@plantarium/types';
import { join } from 'helpers';
import { logger } from '@plantarium/helpers';
import cross from 'helpers/cross';
import arbitraryRotate from 'helpers/arbitraryRotate';
import { Vec3 } from 'ogl';

const log = logger('gen.gravity');
logger.setFilter('gen.gravity');

export function skeleton(part: PlantPart, settings: PlantariumSettings) {
  const { input, type, strength } = part.parameters;

  log(type, strength);

  const {
    result: { skeletons: inputSkeletons },
  } = input;

  const skeletons = inputSkeletons.map((skelly) => {
    const amount = skelly.length / 4;

    // Loop over every single joint in the skeleton
    for (let i = 1; i < amount; i++) {
      const x = skelly[i * 4 + 0];
      const y = skelly[i * 4 + 1];
      const z = skelly[i * 4 + 2];

      const axis = new Vec3().fromArray(cross(x, y, z, 0, 1, 0)).normalize();

      log(axis);

      //Rotate all the other joints
      for (let j = i; j < amount; j++) {
        const rot = arbitraryRotate([x, y, z], strength, axis);

        skelly[j * 4 + 0] = rot[0];
        skelly[j * 4 + 1] = rot[1];
        skelly[j * 4 + 2] = rot[2];
      }
    }

    return skelly;
  });

  return {
    skeletons,
  };
}
