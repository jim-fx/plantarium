import noise from '../../helpers/noise';
import curveToArray from '../../helpers/curveToArray';
import interpolateArray from '../../helpers/interpolateArray';
import { PlantariumSettings } from '@plantarium/types';

// const toRadian = Math.PI / 180;

// function getStemSize(size: Parameter, i: number) {
//   if ('variation' in size) {
//     return (
//       size.value -
//       size.value * size.variation * ((noise.n1d(12312 + i * 400) + 1) / 2)
//     );
//   } else {
//     return size.value;
//   }
// }

// function getOriginAngle(h: Parameter, i: number) {
//   if ('variation' in h) {
//     return (
//       h.value * toRadian +
//       h.value * toRadian * noise.n1d(531723 + i * 200) * h.variation
//     );
//   } else {
//     return h.value * toRadian;
//   }
// }

// function getOriginRotation(h: Parameter, i: number, amount: number) {
//   if ('variation' in h) {
//     return (
//       h.value * (i / amount) * toRadian +
//       noise.n1d(31231 + i * 300) * h.variation * toRadian
//     );
//   } else {
//     return h.value * (i / amount) * toRadian;
//   }
// }

// function getOriginPosition(pos: Parameter, i: number) {
//   if ('variation' in pos) {
//     return [pos.value + noise.n1d(15092 + i * 512) * pos.variation, 0, 0];
//   } else {
//     return [pos.value, 0, 0];
//   }
// }

// function getOrigin(
//   rot: Parameter,
//   pos: Parameter,
//   i: number,
//   amount: number,
// ): number[] {
//   const origin = getOriginPosition(pos, i);
//   const rotation = getOriginRotation(rot, i, amount);

//   const x = Math.cos(rotation) * origin[0] - Math.sin(rotation) * origin[2];
//   const y = origin[1];
//   const z = Math.sin(rotation) * origin[0] + Math.cos(rotation) * origin[2];

//   return [-x, y, z];
// }

// function getNoiseStrength(noise: Parameter) {
//   if (noise.curve && noise.curve.length) {
//     return curveToArray(noise.curve);
//   } else {
//     return [0, 1];
//   }
// }

export default function createStemSkeleton(
  parameters,
  settings: PlantariumSettings,
) {
  const {
    origin = { x: 0, y: 0, z: 0 },
    height = 3,
    thiccness = 0.4,
  } = parameters;

  const { stemResY: amountPoints = 20 } = settings;

  const skeleton = new Float32Array(amountPoints * 4);

  console.log('skeleton.stem');

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

  return {
    skeletons: [skeleton],
    parameters,
    type: 'stem',
  };
}
