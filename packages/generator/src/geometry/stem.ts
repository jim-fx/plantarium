import { tube } from 'geometry';
import { PlantariumSettings } from '@plantarium/types';
import { join } from 'helper';

export default function createStemGeometry(
  part: PlantPart,
  settings: PlantariumSettings,
) {
  const { stemResX = 3 } = settings;

  if (part.skeletons.length === 1) {
    return tube(part.skeletons[0], stemResX);
  } else {
    return join(...part.skeletons.map((skelly) => tube(skelly, stemResX)));
  }
}
