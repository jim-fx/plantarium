import noise from "./helper/noise";

let skeleton: Float32Array;
let oldDescription: string;

const toRadian = Math.PI / 180;

function getStemSize(size: parameter, i: number) {
  if ("variation" in size) {
    return size.value + size.value * (noise.n1d(12312 + i * 400) * size.variation);
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

  for (let i = 0; i < amountPoints; i++) {
    const a = i / amountPoints;

    //Create point
    const x = origin[0];
    const y = a * stemsize;
    const z = origin[2];

    //Apply gravity
    const gravityAngle = gravity * a + originAngle;
    const _x = Math.cos(gravityAngle) * (x - origin[0]) - Math.sin(gravityAngle) * (y - origin[1]) + origin[0];
    const _y = Math.sin(gravityAngle) * (x - origin[0]) + Math.cos(gravityAngle) * (y - origin[1]) + origin[1];
    const _z = z;

    //Apply rotation on the XZ Plane
    const __x = Math.cos(-XYRotation) * (_x - origin[0]) - Math.sin(-XYRotation) * (_z - origin[2]) + origin[0];
    const __y = _y;
    const __z = Math.sin(-XYRotation) * (_x - origin[0]) + Math.cos(-XYRotation) * (_z - origin[2]) + origin[2];

    skeleton[i * 3 + 0] = __x;
    skeleton[i * 3 + 1] = __y;
    skeleton[i * 3 + 2] = __z;
  }

  return skeleton;
}
