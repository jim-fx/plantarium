import { tube } from 'shapes';
import { PlantariumSettings } from '@plantarium/types';
import { join } from 'helpers';
import noise from '../helpers/noise';
import curveToArray from '../helpers/curveToArray';
import interpolateArray from '../helpers/interpolateArray';

export const skeleton = (part: PlantPart, settings: PlantariumSettings) => {
  console.log('skeleton.stem', part);

  const {
    origin = { x: 0, y: 0, z: 0 },
    height = 3,
    thiccness = 0.4,
    amount = 1,
  } = part.parameters;

  const { stemResY: amountPoints = 20 } = settings;

  const skeleton = new Float32Array(amountPoints * 4);

  for (let j = 0; j < amountPoints; j++) {
    const a = j / amountPoints;

    //Create point
    const x = origin.x;
    const y = origin.z + a * height;
    const z = origin.y;

    skeleton[j * 4 + 0] = x;
    skeleton[j * 4 + 1] = y;
    skeleton[j * 4 + 2] = z;
    skeleton[j * 4 + 3] = (1 - a) * thiccness;
  }

  return new Array(amount).fill(null).map(() => skeleton.slice(0));
};

export const geometry = (part: PlantPart, settings: PlantariumSettings) => {
  const { stemResX = 3 } = settings;

  console.log('geometry.stem', part);

  return join(...part.skeletons.map((skelly) => tube(skelly, stemResX)));
};
