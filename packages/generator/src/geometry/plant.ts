import {
  PlantDescription,
  PlantariumSettings,
  PartDescription,
} from '@plantarium/types';
import createPartSkeleton from 'skeleton/createPartSkeleton';
import createPartGeometry from 'geometry/createPartGeometry';

export default function plant(p: PlantDescription, s: PlantariumSettings) {
  const part = (p as unknown) as PlantPart;

  const skelly = createPartSkeleton(part, s);

  const geometry = createPartGeometry(skelly, s);

  return geometry;
}
