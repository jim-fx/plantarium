import { PlantDescription, PlantariumSettings } from '@plantarium/types';
import { logger } from '@plantarium/helpers';
import { calculateNormals } from 'helpers';
import * as create from 'components';

const log = logger('gen.plant');

const isPlantPart = (value): value is PlantPart => {
  return typeof value === 'object' && 'type' in value;
};

const handleSkeletonNode = (
  part: PlantPart,
  s: PlantariumSettings,
): PlantPart => {
  log('skeleton.' + part.type, part);

  const parameters = {};
  Object.entries(part.parameters).forEach(([key, value]) => {
    parameters[key] = isPlantPart(value) ? handleSkeletonNode(value, s) : value;
  });
  part.parameters = parameters;

  part.result = create.skeleton(part, s);

  log('skeleton.' + part.type, part.result);

  return part;
};

const handleGeometryNode = (
  part: PlantPart,
  s: PlantariumSettings,
): PlantPart => {
  log('geometry.' + part.type, part);

  const parameters = {};
  Object.entries(part.parameters).forEach(([key, value]) => {
    parameters[key] = isPlantPart(value) ? handleGeometryNode(value, s) : value;
  });

  part.parameters = parameters;

  part.result = { ...part.result, ...create.geometry(part, s) };

  log('geometry.' + part.type, part.result);

  return part;
};

export default function plant(p: PlantDescription, s: PlantariumSettings) {
  const rootNode = (p as unknown) as PlantPart;

  const skelly = handleSkeletonNode(rootNode, s);

  log('final skeleton', skelly);

  const final = handleGeometryNode(skelly, s);

  log('geo', final);

  return calculateNormals(final.result.geometry);
}
