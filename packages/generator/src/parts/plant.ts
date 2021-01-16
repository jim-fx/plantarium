import { PlantDescription, PlantariumSettings } from '@plantarium/types';
import * as components from 'components';
import { calculateNormals } from 'helpers';

const loop = (
  obj: { [key: string]: any },
  cb: (key: string, val: any) => any,
) => {
  const res = {};

  Object.entries(obj).forEach(([key, value]) => {
    res[key] = cb(key, value) ?? value;
  });

  return res;
};

const isPlantPart = (val) => typeof val === 'object' && 'type' in val;

const createSkeleton = (part: PlantPart, s: PlantariumSettings): PlantPart => {
  part.parameters = loop(part.parameters, (key, value) => {
    if (isPlantPart(value)) return createSkeleton(value, s);
    return value;
  });

  part.skeletons = components.skeleton(part, s);

  console.log('loop.skell.' + part.type, part.skeletons);

  return part;
};

const createGeometry = (part: PlantPart, s: PlantariumSettings): PlantPart => {
  part.parameters = loop(part.parameters, (key, value) => {
    if (isPlantPart(value)) return createGeometry(value, s);
    return value;
  });

  part.geometry = components.geometry(part, s);

  console.log('loop.geo.' + part.type, part.geometry);

  return part;
};

export default function plant(part: PlantPart, s: PlantariumSettings) {
  try {
    const clone = JSON.parse(JSON.stringify(part));

    const skeletons = createSkeleton(clone, s);

    console.log('final skeleton', skeletons);

    const res = createGeometry(skeletons, s);

    console.log('final geometry', res);

    return calculateNormals(res.geometry);
  } catch (error) {
    console.error(error);
  }
}
