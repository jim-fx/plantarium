import { curveToArray, interpolateArray } from "./helper";

function getCurvatureArray(param: parameter) {
  if (param.curve && param.curve.length > 2) {
    return curveToArray(param.curve).map((v, i, a) => v - 1 * (i / a.length));
  } else {
    return [0, 0];
  }
}

export default function(leaf: leafDescription, settings: settings, branchSkeletons: Float32Array[][], stemSkeletons: Float32Array[]) {
  const leafPoints = leaf.shape;
  const leafPointsAmount = leaf.shape.length;
  const leafRes = settings.leafResX || 5;

  //////////////////////////
  //-Create leaf Geometry-//
  //////////////////////////

  const uv = new Float32Array(leafPointsAmount * leafRes * 2);
  const position = new Float32Array(leafPointsAmount * leafRes * 3);
  const normal = new Float32Array(leafPointsAmount * leafRes * 3);
  const index = new Uint16Array((leafPointsAmount - 1) * (leafRes - 1) * 6);

  const leafSize: number = leaf.size.value || 1;

  const yCurvatureArray = getCurvatureArray(leaf.yCurvature);
  const yCurvatureStrength = leaf.yCurvature.value;

  const gravity = leaf.gravity || 0;

  const xCurvatureArray = getCurvatureArray(leaf.xCurvature);
  const xCurvatureStrength = leaf.xCurvature.value;

  //Create all the points
  for (let i = 0; i < leafPointsAmount; i++) {
    const p = leafPoints[i];
    const _a = i / (leafPointsAmount - 1);

    for (let j = 0; j < leafRes; j++) {
      const a = -1 * ((j / (leafRes - 1)) * 2 - 1);
      const offset = i * 3 * leafRes + j * 3;

      const x = a * p.x * leafSize * 0.5;
      const y = interpolateArray(yCurvatureArray, _a) * yCurvatureStrength + interpolateArray(xCurvatureArray, Math.abs(a)) * xCurvatureStrength * Math.sin(Math.abs(_a) * Math.PI);
      const z = p.y * leafSize;

      const gravityAngle = _a * _a * gravity;
      const curlBack = 1 - _a * 0.2 * gravity;
      const _x = x;
      const _y = (Math.cos(gravityAngle) * y - Math.sin(gravityAngle) * z) * curlBack;
      const _z = (Math.sin(gravityAngle) * y + Math.cos(gravityAngle) * z) * curlBack;

      position[offset + 0] = _x;
      position[offset + 1] = _y;
      position[offset + 2] = _z;

      normal[offset + 0] = _a;
      normal[offset + 1] = 1 - _a;
      normal[offset + 2] = 0;

      const uvOffset = i * 2 * leafRes + j * 2;
      uv[uvOffset + 0] = p.x * a * -0.5 - 0.5;
      uv[uvOffset + 1] = p.y;
    }
  }

  //Create the indeces
  const segmentAmount = leafPointsAmount - 1;
  const facesPerSegment = leafRes - 1;

  for (let i = 0; i < segmentAmount; i++) {
    for (let j = 0; j < facesPerSegment; j++) {
      const _o = i * facesPerSegment * 6 + j * 6;
      const o = i * leafRes + j;

      index[_o + 0] = o;
      index[_o + 1] = o + 1;
      index[_o + 2] = o + 1 + leafRes;

      index[_o + 3] = o + 1 + leafRes;
      index[_o + 4] = o + leafRes;
      index[_o + 5] = o;
    }
  }

  //////////////////////
  //-Create instances-//
  //////////////////////

  const useStem = !!leaf.onStem;
  const useBranches = !!leaf.onBranches;

  const skeletons: Float32Array[] = [];

  if (useBranches) {
    skeletons.push(...branchSkeletons.flat());
  }

  if (useStem) {
    skeletons.push(...stemSkeletons);
  }

  const skeletonL = skeletons.reduce((a, b) => a + b.length, 0);

  const offset = new Float32Array(skeletonL);
  const scale = new Float32Array(skeletonL);
  const rotation = new Float32Array(skeletonL);

  let _offset = 0;
  for (let i = 0; i < skeletons.length; i++) {
    const skelly = skeletons[i];
    const l = skelly.length;

    for (let j = 0; j < l; j++) {
      offset[_offset + j] = skelly[j];
      scale[_offset + j] = 1 - j / (l - 1);
      rotation[_offset + j] = skelly[j] * 10;
    }
    _offset += l;
  }

  return {
    position,
    normal,
    uv,
    index,
    offset,
    rotation,
    scale
  };
}
