import { PlantariumSettings } from '@plantarium/types';
import createStemGeometry from './geometry/stem';
import createBranchGeometry from './geometry/branch';

export default function (part: PlantPart, settings: PlantariumSettings) {
  switch (part.type) {
    case 'stem':
      return createStemGeometry(part, settings);
    case 'branch':
      return createBranchGeometry(part, settings);
  }
  return part;
}
