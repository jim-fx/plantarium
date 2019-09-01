import noise from "./helper/noise";
import curveToArray from "./helper/curveToArray";
import interpolateArray from "./helper/interpolateArray";

let skeleton: Float32Array;
let oldDescription: string;

const toRadian = Math.PI / 180;

function getStemSize(size: parameter, i: number) {
  if ("variation" in size) {
    return size.value - size.value * size.variation * ((noise.n1d(12312 + i * 400) + 1) / 2);
  } else {
    return size.value;
  }
}

function getOriginAngle(h, i) {
  if ("variation" in h) {
    return h.value * toRadian + h.value * toRadian * noise.n1d(531723 + i * 200) * h.variation;
  } else {
    return h.value * toRadian;
  }
}

function getOriginRotation(h, i) {
  if ("variation" in h) {
    return h.value * i * toRadian + noise.n1d(31231 + i * 300) * h.variation * toRadian;
  } else {
    return h.value * i * toRadian;
  }
}

function getOriginPosition(pos, i) {
  if ("variation" in pos) {
    return [pos.value + noise.n1d(15092 + i * 512) * pos.variation, 0, 0];
  } else {
    return [pos.value, 0, 0];
  }
}

function getOrigin(rot: parameter, pos: parameter, i: number): number[] {
  const origin = getOriginPosition(pos, i);
  const rotation = getOriginRotation(rot, i);

  const x = Math.cos(rotation) * origin[0] - Math.sin(rotation) * origin[2];
  const y = origin[1];
  const z = Math.sin(rotation) * origin[0] + Math.cos(rotation) * origin[2];

  return [-x, y, z];
}

function getNoiseStrength(noise: parameter) {
  if (noise.curve && noise.curve.length) {
    return curveToArray(noise.curve);
  } else {
    return [0, 1];
  }
}

export default function(stem: stemDescription, settings: settings, i: number): Float32Array {
  //Check if we need to regenerate else return cached skeleton
  const newDescription = JSON.stringify(stem);
  if (!settings.forceUpdate && oldDescription === newDescription && skeleton.length) {
    return skeleton;
  }

  const amountPoints = settings.stemResY || 8;
  skeleton = new Float32Array(amountPoints * 3);

  const stemsize = getStemSize(stem.size, i);

  const origin = getOrigin(stem.originRotation, stem.originOffset, i);
  const originAngle = getOriginAngle(stem.originAngle, i);
  const XYRotation = getOriginRotation(stem.originRotation, i);

  const gravity = (stem.gravity || 0) * Math.PI * 0.5;

  const noiseScale = stem.noiseScale || 1;
  const noiseStrength = stem.noiseStrength.value || 0;
  let noiseStrengthCurve;
  if (noiseStrength) {
    noiseStrengthCurve = getNoiseStrength(stem.noiseStrength);
  }

  for (let j = 0; j < amountPoints; j++) {
    const a = j / amountPoints;

    //Create point
    let x = origin[0];
    const y = a * stemsize;
    let z = origin[2];

    if (noiseStrength) {
      x += noise.n1d(2312312 + a * noiseScale + i * 100) * interpolateArray(noiseStrengthCurve, a) * noiseStrength;
      z += noise.n1d(92538165 + a * noiseScale + i * 100) * interpolateArray(noiseStrengthCurve, a) * noiseStrength;
    }

    //Apply gravity
    const gravityAngle = gravity * a + originAngle;
    const _x = Math.cos(gravityAngle) * (x - origin[0]) - Math.sin(gravityAngle) * (y - origin[1]) + origin[0];
    const _y = Math.sin(gravityAngle) * (x - origin[0]) + Math.cos(gravityAngle) * (y - origin[1]) + origin[1];
    const _z = z;

    //Apply rotation on the XZ Plane
    const __x = Math.cos(-XYRotation) * (_x - origin[0]) - Math.sin(-XYRotation) * (_z - origin[2]) + origin[0];
    const __y = _y;
    const __z = Math.sin(-XYRotation) * (_x - origin[0]) + Math.cos(-XYRotation) * (_z - origin[2]) + origin[2];

    skeleton[j * 3 + 0] = __x;
    skeleton[j * 3 + 1] = __y;
    skeleton[j * 3 + 2] = __z;
  }

  return skeleton;
}
