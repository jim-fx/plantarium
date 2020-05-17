import createBranchSkeleton from './branch';
import createStemSkeleton from './stem';
import { PlantariumSettings } from '@plantarium/types';

export default function (
  part: PlantPart,
  settings: PlantariumSettings,
): PlantPart {
  switch (part.type) {
    case 'stem':
      return createStemSkeleton(part.parameters, settings);
  }

  return part;
}
