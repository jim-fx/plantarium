export function translateSkeleton(skeleton: Float32Array, [ox, oy, oz]: [number, number, number]) {

  let length = skeleton.length / 4;

  let i = -1;
  while (i++ < length - 1) {
    skeleton[i * 4 + 0] = skeleton[i * 4 + 0] + ox;
    skeleton[i * 4 + 1] = skeleton[i * 4 + 1] + oy;
    skeleton[i * 4 + 2] = skeleton[i * 4 + 2] + oz;
  }

  return skeleton;

}
