import {
  curveToArray,
  interpolateArray,
  interpolateSkeleton,
  noise,
} from './helper';
import { Vec3 } from 'ogl';
import { PlantariumSettings } from '@plantarium/types';

function getCurvatureArray(param: Parameter) {
  if (param.curve && param.curve.length > 2) {
    return curveToArray(param.curve).map(
      (v, i, a) => (v - 1 * (i / a.length)) * 0.2,
    );
  } else {
    return [0, 0];
  }
}

function getSizeArray(param: Parameter) {
  if (param.curve && param.curve.length > 2) {
    return curveToArray(param.curve).map(
      (v, i, a) => param.value * (v - 1 * (i / a.length - 1)),
    );
  } else {
    return [param.value];
  }
}

export default function (
  leaf: LeafDescription,
  settings: PlantariumSettings,
  branchSkeletons: Float32Array[][],
  stemSkeletons: Float32Array[],
) {
  const leafPoints = leaf.shape;
  const leafPointsAmount = leaf.shape.length;
  const leafRes = settings.leafResX || 5;

  /////////////////////////////
  // - Create leaf Geometry -//
  /////////////////////////////

  const uv = new Float32Array(leafPointsAmount * leafRes * 2);
  const position = new Float32Array(leafPointsAmount * leafRes * 3);
  const normal = new Float32Array(leafPointsAmount * leafRes * 3);
  const index = new Uint16Array((leafPointsAmount - 1) * (leafRes - 1) * 6);

  const yCurvatureArray = getCurvatureArray(leaf.yCurvature);
  const yCurvatureStrength = leaf.yCurvature.value;

  const gravity = leaf.gravity || 0;

  const xCurvatureArray = getCurvatureArray(leaf.xCurvature);
  const xCurvatureStrength = leaf.xCurvature.value;

  // Create all the points
  for (let i = 0; i < leafPointsAmount; i++) {
    const p = leafPoints[i];
    const _a = i / (leafPointsAmount - 1);

    for (let j = 0; j < leafRes; j++) {
      const a = -1 * ((j / (leafRes - 1)) * 2 - 1);
      const tempOffset = i * 3 * leafRes + j * 3;

      const x = a * p.x * 0.5;
      const y =
        interpolateArray(yCurvatureArray, _a) * yCurvatureStrength +
        interpolateArray(xCurvatureArray, Math.abs(a)) *
          xCurvatureStrength *
          Math.sin(Math.abs(_a) * Math.PI);
      const z = p.y;

      const gravityAngle = _a * _a * gravity;
      const curlBack = 1 - _a * 0.2 * gravity;
      const _x = x;
      const _y =
        (Math.cos(gravityAngle) * y - Math.sin(gravityAngle) * z) * curlBack;
      const _z =
        (Math.sin(gravityAngle) * y + Math.cos(gravityAngle) * z) * curlBack;

      position[tempOffset + 0] = _x;
      position[tempOffset + 1] = _y;
      position[tempOffset + 2] = _z;

      normal[tempOffset + 0] = _a;
      normal[tempOffset + 1] = 1 - _a;
      normal[tempOffset + 2] = 0;

      const uvOffset = i * 2 * leafRes + j * 2;
      uv[uvOffset + 0] = p.x * a * -0.5 - 0.5;
      uv[uvOffset + 1] = p.y;
    }
  }

  // Create the indeces
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

  ////////////////////////
  // -Create instances- //
  ////////////////////////

  const leafAmount = leaf.amount || 3;
  const lowestLeaf = leaf.lowestLeaf || 0;
  const leafDistance = (1 - lowestLeaf) / (leafAmount - 1);
  const onStem = !!leaf.onStem;
  const onBranches = !!leaf.onBranches;

  const leafAngle = leaf.angle.value || 0;
  const leafAngleArray = getSizeArray(leaf.angle);
  const leafAngleVariation = leaf.angle.variation || 0;

  const leafRotation = leaf.rotation.value || 0;
  const leafRotationVariation = leaf.rotation.variation || 0;

  const leafOffset = leaf.offset.value || 0;
  const leafOffsetVariation = leaf.offset.variation || 0;

  const leafSizeArray = getSizeArray(leaf.size);
  const leafSizeVariation = leaf.size.variation || 0;

  const instanceCount =
    (onStem ? stemSkeletons.length : 0) * leafAmount +
    (onBranches ? branchSkeletons.flat().length : 0) * leafAmount;

  const offset = new Float32Array(instanceCount * 3);
  const scale = new Float32Array(instanceCount * 3);
  const rotation = new Float32Array(instanceCount * 3);

  const dirVec = new Vec3(0, 0, 1);

  let _offset = 0;
  const stemAmount = stemSkeletons.length;
  for (let i = 0; i < stemAmount; i++) {
    if (onStem) {
      const stemSkeleton = stemSkeletons[i];
      const amountPoints = stemSkeleton.length / 3;

      for (let k = 0; k < leafAmount; k++) {
        const switchSide = k % 2 === 0;
        const alpha = k / (leafAmount - 1);

        let positionAlongStem =
          1 -
          k * leafDistance -
          (switchSide ? (leafOffset - 1) * leafDistance : 0) * 4;

        if (leafOffsetVariation) {
          positionAlongStem -=
            leafDistance *
            2 *
            noise.n1d(123123923 + k * 2324 + i * 24124) *
            leafOffsetVariation;
        }

        const origin = new Vec3().fromArray(
          interpolateSkeleton(stemSkeleton, positionAlongStem),
        );

        const _alpha = (amountPoints - 1) * alpha;

        // Get previous and next stem segment
        const p = Math.floor(_alpha);
        const n = Math.ceil(_alpha);

        const prev = new Vec3(
          stemSkeleton[p * 3 + 0],
          stemSkeleton[p * 3 + 1],
          stemSkeleton[p * 3 + 2],
        );
        const next = new Vec3(
          stemSkeleton[n * 3 + 0],
          stemSkeleton[n * 3 + 1],
          stemSkeleton[n * 3 + 2],
        );

        offset[_offset + 0] = origin[0];
        offset[_offset + 1] = origin[1];
        offset[_offset + 2] = origin[2];

        const _leafSize = interpolateArray(leafSizeArray, 1 - alpha);
        let s = _leafSize * alpha * (1 - k / (leafAmount - 1));
        if (leafSizeVariation) {
          s -=
            s *
            ((noise.n1d(1297213 + k * 123 + i * 942) + 1) / 2) *
            leafSizeVariation;
        }
        scale[_offset + 0] = s;
        scale[_offset + 1] = s;
        scale[_offset + 2] = s;

        const _next = next.clone().sub(prev);
        _next[1] = 0;
        _next.normalize();

        let rotY = dirVec.angle(_next) * (_next.x > 0 ? 1 : -1);
        if (leafAngleVariation) {
          rotY -=
            rotY *
            noise.n1d(1297213 + k * 123 + i * 942) *
            leafAngleVariation *
            2;
        }

        let _leafRotation = leafRotation;
        if (leafRotationVariation) {
          _leafRotation -=
            _leafRotation *
            noise.n1d(1297213 + k * 123 + i * 942) *
            leafRotationVariation;
        }
        const _leafAngle = interpolateArray(leafAngleArray, alpha);

        rotation[_offset + 0] = _leafRotation;
        rotation[_offset + 1] = rotY + (switchSide ? _leafAngle : -_leafAngle);
        rotation[_offset + 2] = 0;

        _offset += 3;
      }
    }

    // Create leaves along branch
    if (onBranches) {
      const _branchSkeletons = branchSkeletons[i];
      const branchAmount = _branchSkeletons.length;

      for (let j = 0; j < branchAmount; j++) {
        const branchSkeleton = _branchSkeletons[j];
        const amountPoints = branchSkeleton.length / 3;

        for (let k = 0; k < leafAmount - 1; k++) {
          const switchSide = k % 2 === 0;
          const alpha = k / (leafAmount - 1);

          let positionAlongStem =
            1 -
            k * leafDistance -
            (switchSide ? (leafOffset - 1) * leafDistance : 0) * 4;

          if (leafOffsetVariation) {
            positionAlongStem -=
              leafDistance *
              2 *
              noise.n1d(123123923 + k * 2324 + i * 24124) *
              leafOffsetVariation;
          }

          const origin = new Vec3().fromArray(
            interpolateSkeleton(branchSkeleton, positionAlongStem),
          );

          const _alpha = (amountPoints - 1) * alpha;

          // Get previous and next stem segment
          const p = Math.floor(_alpha);
          const n = Math.ceil(_alpha);

          const prev = new Vec3(
            branchSkeleton[p * 3 + 0],
            branchSkeleton[p * 3 + 1],
            branchSkeleton[p * 3 + 2],
          );
          const next = new Vec3(
            branchSkeleton[n * 3 + 0],
            branchSkeleton[n * 3 + 1],
            branchSkeleton[n * 3 + 2],
          );

          offset[_offset + 0] = origin[0];
          offset[_offset + 1] = origin[1];
          offset[_offset + 2] = origin[2];

          const _leafSize = interpolateArray(leafSizeArray, 1 - alpha);
          let s = _leafSize * alpha * (1 - j / (branchAmount - 1));
          if (leafSizeVariation) {
            s -=
              s *
              ((noise.n1d(1297213 + k * 123 + i * 942) + 1) / 2) *
              leafSizeVariation;
          }
          scale[_offset + 0] = s;
          scale[_offset + 1] = s;
          scale[_offset + 2] = s;

          const _next = next.clone().sub(prev);
          _next[1] = 0;
          _next.normalize();

          let rotY = dirVec.angle(_next) * (_next.x > 0 ? 1 : -1);
          if (leafAngleVariation) {
            rotY -=
              rotY *
              noise.n1d(1297213 + k * 123 + i * 942) *
              leafAngleVariation *
              2;
          }

          let _leafRotation = leafRotation;
          if (leafRotationVariation) {
            _leafRotation -=
              _leafRotation *
              noise.n1d(1297213 + k * 123 + i * 942) *
              leafRotationVariation;
          }
          const _leafAngle = interpolateArray(leafAngleArray, alpha);

          rotation[_offset + 0] = _leafRotation;
          rotation[_offset + 1] =
            rotY + (switchSide ? _leafAngle : -_leafAngle);
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
    scale,
  };
}
