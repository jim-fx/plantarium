import { rotate3D } from "../helpers";
import { translateSkeleton } from "./translateSkeleton";

export function rotateSkeleton(skeleton: Float32Array, axis: [number, number, number], angle = 1, origin?: [number, number, number], lerp = false) {

  const [ox = 0, oy = 0, oz = 0] = origin || skeleton;

  // If the origin is set translate the skeleton to move to it
  translateSkeleton(skeleton, [-ox, -oy, -oz])


  const length = skeleton.length / 4;
  let i = -1;

  while (i++ < length - 1) {

    const p = skeleton.slice(i * 4, i * 4 + 3);

    const a = i / length;

    const rotated = rotate3D([...p], axis, lerp ? angle * a : angle);

    skeleton[i * 4 + 0] = rotated[0];
    skeleton[i * 4 + 1] = rotated[1];
    skeleton[i * 4 + 2] = rotated[2];

  }


  translateSkeleton(skeleton, [ox, oy, oz]);

  return skeleton;

}
