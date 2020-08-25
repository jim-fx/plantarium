import { PlantDescription, PlantariumSettings } from '@plantarium/types';
import createSkeletonPart from 'parts/createSkeletonPart';
import createGeometryPart from 'parts/createGeometryPart';
import { calculateNormals } from 'helpers';
export default function plant(p: PlantDescription, s: PlantariumSettings) {
  const part = (p as unknown) as PlantPart;

  const skelly = createSkeletonPart(part, s);

  console.log('skelly', skelly);

  const geometry = createGeometryPart(skelly, s);

  console.log('geo', geometry); 

  return calculateNormals(geometry as TransferGeometry);
}
