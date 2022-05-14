import { findOrthogonalVector, interpolateSkeletonVec, normalize3D } from "../helpers";
import { rotateSkeleton } from "./rotateSkeleton";

export function splitSkeleton(skeleton: Float32Array, distance = 0.5, amount = 2, angle = 1) {

  const _distance = Math.max(Math.min(distance, 1), 0);

  const _amount = Math.floor(Math.max(0, amount));

  if (_amount < 2) return [skeleton];

  const length = skeleton.length / 4;
  const oldSkellyLength = Math.floor(length * _distance);

  // Calculate the rotational axis
  const stemAxis = normalize3D(interpolateSkeletonVec(skeleton, _distance));

  const orthoAxis = normalize3D(findOrthogonalVector(stemAxis));

  return [
    // Only return the old skeleton if it has any length
    ...(oldSkellyLength < 0 ? [] : [skeleton.slice(0, oldSkellyLength * 4)]),
    ...new Array(_amount).fill(null).map((_, i) => {
      const newSkelly = skeleton.slice((oldSkellyLength - 2) * 4);

      const a = i / amount;

      rotateSkeleton(newSkelly, orthoAxis, angle, undefined, true)

      rotateSkeleton(newSkelly, stemAxis, a * 6)

      return newSkelly;
    })
  ].filter(v => v.length > 4)


}
