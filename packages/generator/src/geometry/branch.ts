import { join } from '.';
import tube from './tube';
import { PlantariumSettings } from '@plantarium/types';

export default function createBranchGeometry(
  part: PlantPart,
  settings: PlantariumSettings,
) {
  const { stemResX = 3 } = settings;

  return join(
    ...part.skeletons.map((skeleton) => {
      return tube(skeleton, stemResX);
    }),
  );
}
