import { curveToArray, noise, interpolateArray, interpolateSkeleton, draw } from "./helper";
import { Vec3 } from "ogl";

function getLowestBranch(param: parameter, i: number) {
  if ("variation" in param) {
    return param.value - param.value * param.variation * noise.n1d(931852 + i * 600);
  } else {
    return param.value;
  }
}

function getBranchLengthArray(length: parameter, i: number) {
  let v = length.value;
  if (length.curve) {
    return curveToArray(length.curve).map(_v => _v * v);
  } else {
    return [0, 1 * v];
  }
}

export default function(branch: branchDescription, settings: settings, skeleton: Float32Array, i: number): Float32Array[] {
  const branches: Float32Array[] = [];

  const branchAmount = branch.amount || 3;
  const lowestBranch = getLowestBranch(branch.lowestBranch, i);

  const branchLengthArray = getBranchLengthArray(branch.length, i);
  const branchLengthVariation = branch.length.variation || 0;

  const branchOffset = branch.offset.value || 0;
  const branchOffsetVariation = branch.offset.variation || 0;

  const branchDistance = (1 - lowestBranch) / branchAmount;

  const skeletonLength = skeleton.length / 3;

  for (let j = 0; j < branchAmount; j++) {
    const a = j / branchAmount;

    let length = interpolateArray(branchLengthArray, 1 - a);
    if (branchLengthVariation) {
      length -= length * branchLengthVariation * ((noise.n1d(341341 + j * 123969) + 1) / 2);
    }

    let positionAlongStem = lowestBranch + j * branchDistance;
    if (branchOffsetVariation) {
      positionAlongStem -= branchDistance * branchOffsetVariation * noise.n1d(92584 + j * 198);
    }

    if (j % 2 === 0) {
      positionAlongStem -= -(1 - branchOffset * 2) * branchDistance;
    }

    const origin = new Vec3().fromArray(interpolateSkeleton(skeleton, positionAlongStem));

    const p = Math.floor(a * skeletonLength);
    const n = Math.ceil(a * skeletonLength);

    const prevSegment = new Vec3(origin[0] - skeleton[p * 3 - 3], origin[1] - skeleton[p * 3 - 2], origin[2] - skeleton[p * 3 - 1]);

    const nextSegment = new Vec3(skeleton[n * 3 + 3] - origin[0] / 2, skeleton[n * 3 + 4] - origin[1] / 2, skeleton[n * 3 + 5] - origin[2] / 2);

    const offsetVec = new Vec3().cross(prevSegment, nextSegment).normalize();

    if (j % 2 === 0) {
      const vec = origin.clone().add(offsetVec.multiply(length));
      branches[j] = new Float32Array([origin[0], origin[1], origin[2], vec[0], vec[1], vec[2]]);
    } else {
      const vec = origin.clone().add(offsetVec.multiply(-length));
      branches[j] = new Float32Array([origin[0], origin[1], origin[2], vec[0], vec[1], vec[2]]);
    }

    //const element = array[i];
  }

  return branches;
}
