import createBranch from './skeleton/branch';
import createStem from './skeleton/stem';
import { PlantariumSettings } from '@plantarium/types';
import createStemSkeleton from './skeleton/stem';
import createBranchSkeleton from './skeleton/branch';

export default function (
  part: PlantPart,
  settings: PlantariumSettings,
): PlantPart {
  switch (part.type) {
    case 'stem':
      return createStemSkeleton(part.parameters, settings);
    case 'branch':
      return createBranchSkeleton(part.parameters, settings);
  }

  return part;
}
