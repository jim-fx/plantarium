import { join } from 'helpers';
import { PlantariumSettings } from '@plantarium/types';
import createPartGeometry from 'parts/createGeometryPart';
import tube from 'shapes/tube';

export default function createBranchGeometry(
  part: PlantPart,
  settings: PlantariumSettings,
) {
  console.log('geometry.branch');

  const input = createPartGeometry(part.parameters.input, settings);

  const { stemResX = 3 } = settings;

  return join(
    input.geometry,
    ...part.skeletons.map((skeleton) => {
      return tube(skeleton, stemResX);
    }),
  );
}
