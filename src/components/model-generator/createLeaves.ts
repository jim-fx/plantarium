import { curveToArray, interpolateArray, interpolateSkeleton, draw } from "./helper";
import { Vec3, Quat } from "ogl";

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

  const leafAmount = leaf.amount || 3;
  const lowestLeaf = leaf.lowestLeaf || 0;
  const leafDistance = (1 - lowestLeaf) / (leafAmount - 1);
  const onStem = !!leaf.onStem;
  const onBranches = !!leaf.onBranches;
  const sizeVar = leaf.size.variation || 0;
  const leafAngle = leaf.angle.value || 0;

  const instanceCount = (onStem ? stemSkeletons.length : 0) * leafAmount + (onBranches ? branchSkeletons.flat().length : 0) * leafAmount;

  const offset = new Float32Array(instanceCount * 3);
  const scale = new Float32Array(instanceCount * 3);
  const rotation = new Float32Array(instanceCount * 3);

  const dirVec = new Vec3(0, 0, 1);

  draw(new Vec3(0, 0, 0), dirVec);

  let _offset = 0;
  const stemAmount = stemSkeletons.length;
  for (let i = 0; i < stemAmount; i++) {
    const stemSkeleton = stemSkeletons[i];
    const amountPointsSkelly = stemSkeleton.length;

    //Create leaves along stem
    if (onStem) {
      for (let k = 0; k < leafAmount; k++) {
        const switchSide = k % 2 === 0;
        const alpha = k / (leafAmount - 1);

        const origin = new Vec3().fromArray(interpolateSkeleton(stemSkeleton, 1 - k * leafDistance));

        const _alpha = (amountPointsSkelly - 1) * alpha;

        //Get previous and next stem segment
        const p = Math.floor(_alpha);
        const n = Math.ceil(_alpha);

        const prev = new Vec3(stemSkeleton[p * 3 + 0], stemSkeleton[p * 3 + 1], stemSkeleton[p * 3 + 2]);
        const next = new Vec3(stemSkeleton[n * 3 + 0], stemSkeleton[n * 3 + 1], stemSkeleton[n * 3 + 2]);

        const _next = next.clone().sub(prev);
        _next[1] = 0;
        _next.normalize();

        let rotY = dirVec.angle(_next) * (_next.x > 0 ? 1 : -1);

        offset[_offset + 0] = origin[0];
        offset[_offset + 1] = origin[1];
        offset[_offset + 2] = origin[2];

        const s = alpha * (1 - i / (amountPointsSkelly - 1));
        scale[_offset + 0] = s;
        scale[_offset + 1] = s;
        scale[_offset + 2] = s;

        rotation[_offset + 0] = 0;
        rotation[_offset + 1] = rotY + (switchSide ? leafAngle : -leafAngle);
        rotation[_offset + 2] = 0;

        _offset += 3;
      }
    }

    //Create leaves along branch
    if (onBranches) {
      const _branchSkeletons = branchSkeletons[i];
      const branchAmount = _branchSkeletons.length;

      for (let j = 0; j < branchAmount; j++) {
        const branchSkeleton = _branchSkeletons[j];
        const amountPoints = branchSkeleton.length / 3;

        for (let k = 0; k < leafAmount; k++) {
          const switchSide = k % 2 === 0;
          const alpha = k / (leafAmount - 1);

          const origin = new Vec3().fromArray(interpolateSkeleton(branchSkeleton, 1 - k * leafDistance));

          const _alpha = (amountPoints - 1) * alpha;

          //Get previous and next stem segment
          const p = Math.floor(_alpha);
          const n = Math.ceil(_alpha);

          const prev = new Vec3(branchSkeleton[p * 3 + 0], branchSkeleton[p * 3 + 1], branchSkeleton[p * 3 + 2]);
          const next = new Vec3(branchSkeleton[n * 3 + 0], branchSkeleton[n * 3 + 1], branchSkeleton[n * 3 + 2]);

          const _next = next.clone().sub(prev);
          _next[1] = 0;
          _next.normalize();

          let rotY = dirVec.angle(_next) * (_next.x > 0 ? 1 : -1);

          offset[_offset + 0] = origin[0];
          offset[_offset + 1] = origin[1];
          offset[_offset + 2] = origin[2];

          const s = alpha * (1 - j / (branchAmount - 1));
          scale[_offset + 0] = s;
          scale[_offset + 1] = s;
          scale[_offset + 2] = s;

          rotation[_offset + 0] = 0;
          rotation[_offset + 1] = rotY + (switchSide ? leafAngle : -leafAngle);
          rotation[_offset + 2] = 0;

          _offset += 3;
        }
      }
    }
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
