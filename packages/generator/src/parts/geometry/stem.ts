import { tube } from 'shapes';
import { PlantariumSettings } from '@plantarium/types';
import { join } from 'helpers';

export default function createStemGeometry(
  part: PlantPart,
  settings: PlantariumSettings,
) {
  const { stemResX = 3 } = settings;

  console.log('geometry.stem');

  if (part.skeletons.length === 1) {
    part.geometry = tube(part.skeletons[0], stemResX);
  } else {
    part.geometry = join(
      ...part.skeletons.map((skelly) => tube(skelly, stemResX)),
    );
  }

  return part;
}
