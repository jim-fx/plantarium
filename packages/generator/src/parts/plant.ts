import { PlantDescription, PlantariumSettings } from '@plantarium/types';
import { calculateNormals } from 'helpers';
import * as create from 'components';

const isNode = (value) => {
  return typeof value === 'object' && 'type' in value;
};

const handleSkeletonNode = (
  part: PlantPart,
  s: PlantariumSettings,
): PlantPart => {
  console.log('skeleton.' + part.type, JSON.parse(JSON.stringify(part)));

  const parameters = {};
  Object.entries(part.parameters).forEach(([key, value]) => {
    parameters[key] = isNode(value) ? handleSkeletonNode(value, s) : value;
  });
  part.parameters = parameters;

  part.result = create.skeleton(part, s);

  console.log('skeleton.' + part.type, JSON.parse(JSON.stringify(part.result)));

  return part;
};

const handleGeometryNode = (
  part: PlantPart,
  s: PlantariumSettings,
): PlantPart => {
  console.log('geometry.' + part.type, JSON.parse(JSON.stringify(part)));

  const parameters = {};
  Object.entries(part.parameters).forEach(([key, value]) => {
    parameters[key] = isNode(value) ? handleGeometryNode(value, s) : value;
  });

  part.parameters = parameters;

  part.result = { ...part.result, ...create.geometry(part, s) };

  console.log('geometry.' + part.type, JSON.parse(JSON.stringify(part.result)));

  return part;
};

export default function plant(p: PlantDescription, s: PlantariumSettings) {
  const rootNode = (p as unknown) as PlantPart;

  const skelly = handleSkeletonNode(rootNode, s);

  console.log('final skeleton', JSON.parse(JSON.stringify(skelly)));

  const final = handleGeometryNode(skelly, s);

  console.log('geo', final);

  return calculateNormals(final.result.geometry);
}
