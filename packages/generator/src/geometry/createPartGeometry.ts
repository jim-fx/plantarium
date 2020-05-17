import { PlantariumSettings } from '@plantarium/types';
import createStemGeometry from './stem';
import createBranchGeometry from './branch';

export default function (part: PlantPart, settings: PlantariumSettings) {
  switch (part.type) {
    case 'stem':
      return createStemGeometry(part, settings);
  }

  return part;
}
