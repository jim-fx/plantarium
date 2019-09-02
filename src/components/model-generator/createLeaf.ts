import { curveToArray, interpolateArray, interpolateSkeleton } from "./helper";
import { Vec3 } from "ogl";

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

  const instanceCount = (onStem ? stemSkeletons.length : 0) * leafAmount + (onBranches ? branchSkeletons.flat().length : 0) * leafAmount;

  const offset = new Float32Array(instanceCount * 3);
  const scale = new Float32Array(instanceCount * 3);
  const rotation = new Float32Array(instanceCount * 3);

  let _offset = 0;
  const stemAmount = stemSkeletons.length;
  for (let i = 0; i < stemAmount; i++) {
    const stemSkeleton = stemSkeletons[i];

    //Create leaves along stem
    if (onStem) {
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
          const origin = new Vec3().fromArray(interpolateSkeleton(branchSkeleton, 1 - leafDistance * k));

          //Get previos and next stem segment
          const p = Math.floor(alpha * amountPoints);
          const n = Math.ceil(alpha * amountPoints);

          const prevPoint = new Vec3(branchSkeleton[p * 3 + 0], branchSkeleton[p * 3 + 1], branchSkeleton[p * 3 + 2]);

          const prevSegment = new Vec3(origin[0] - branchSkeleton[p * 3 + 0], origin[1] - branchSkeleton[p * 3 + 1], origin[2] - branchSkeleton[p * 3 + 2]);

          const nextSegment = new Vec3(origin[0] - branchSkeleton[n * 3 + 0], origin[1] - branchSkeleton[n * 3 + 1], origin[2] - branchSkeleton[n * 3 + 2]);

          const averageVec = new Vec3((prevSegment[0] + nextSegment[0]) / 2, (prevSegment[1] + nextSegment[1]) / 2, (prevSegment[2] + nextSegment[2]) / 2);

          const offsetVec = new Vec3().cross(prevSegment, nextSegment).normalize();

          const rotVec = origin.dot(averageVec);

          const rotY = new Vec3(1, 0, 0).dot(new Vec3(origin[0], 0, origin[2]).sub(prevPoint));

          offset[_offset + 0] = origin[0];
          offset[_offset + 1] = origin[1];
          offset[_offset + 2] = origin[2];

          scale[_offset + 0] = alpha;
          scale[_offset + 1] = alpha;
          scale[_offset + 2] = alpha;

          rotation[_offset + 0] = 0;
          rotation[_offset + 1] = rotY - (switchSide ? 0 : Math.PI);
          rotation[_offset + 2] = 0;

          _offset += 3;
        }
      }
    }
  }
  /*
  const l = skeletons.length;
  for (let i = 0; i < l; i++) {
    const skelly = skeletons[i];
    const _l = skelly.length;
    for (let j = 0; j < leafAmount; j++) {
      const switchSide = j % 2 === 0;
      const a = j / (leafAmount - 1);

      let positionAlongStem = lowestLeaf + j * leafDistance;

      const origin = interpolateSkeleton(skelly, positionAlongStem);

      const p = Math.max(Math.min(Math.floor(_l * positionAlongStem), _l - 3), 1);
      const n = Math.max(Math.min(Math.ceil(_l * positionAlongStem), _l - 2), 1);

      const prevSegment = new Vec3(origin[0] - skelly[p + 0], origin[1] - skelly[p + 1], origin[2] - skelly[p + 2]);

      const nextSegment = new Vec3(origin[0] - skelly[n + 0], origin[1] - skelly[n + 1], origin[2] - skelly[n + 2]);

      //console.log(nextSegment.len(), prevSegment.len());

      const angle = prevSegment.dot(nextSegment);

      const off = _offset + j * 3;
      offset[off + 0] = origin[0];
      offset[off + 1] = origin[1];
      offset[off + 2] = origin[2];

      rotation[off + 0] = 0;
      rotation[off + 1] = switchSide ? -angle : angle;
      rotation[off + 2] = 0;

      const s = (1 - a) * leafSize;
      scale[off + 0] = s;
      scale[off + 1] = s;
      scale[off + 2] = s;
    }

    _offset += leafAmount * 3;
  }*/

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
