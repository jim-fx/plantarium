import { TransferGeometry } from '@plantarium/types';
export default function (size = 2, res = 3): TransferGeometry {
  res = res + 2;

  const amountPoints = (res * 4 - 4) * 3;

  const position = new Float32Array(amountPoints * 2);
  const normal = new Float32Array(amountPoints);
  const uv = new Float32Array((res * 4 - 4) * 2);
  const index = new Uint16Array(res * 4);

  //Create lines parallel to the x-axis;
  for (let i = 0; i < res; i++) {
    const a = (i / (res - 1)) * 2 - 1;

    position[i * 6 + 0] = -size;
    position[i * 6 + 1] = 0;
    position[i * 6 + 2] = size * a;

    position[i * 6 + 3] = size;
    position[i * 6 + 4] = 0;
    position[i * 6 + 5] = size * a;
  }

  //Create lines parallel to the y-axis;
  const offsetHalf = res * 6;
  for (let i = 0; i < res; i++) {
    const a = (i / (res - 1)) * 2 - 1;

    position[offsetHalf + i * 6 + 0] = -size * a;
    position[offsetHalf + i * 6 + 1] = 0;
    position[offsetHalf + i * 6 + 2] = -size;

    position[offsetHalf + i * 6 + 3] = -size * a;
    position[offsetHalf + i * 6 + 4] = 0;
    position[offsetHalf + i * 6 + 5] = size;
  }

  return {
    position,
    normal,
    uv,
    index,
  };
}
