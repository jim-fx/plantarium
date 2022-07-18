import { cloneObject } from "@plantarium/helpers";
import type { TransferGeometry, Vec2 } from "@plantarium/types";
import { calculateNormals, normalize3D, rotate2D } from "../helpers";

export default function(
  shape: Vec2[],
  { res = 1, xCurvature = 0.5, yCurvature = 0.2 } = {},
): TransferGeometry {
  const amountY = shape.length;
  const amountX = 3 + res * 2;
  const amountPoints = amountX * amountY;

  const amountTriangles = (amountX - 1) * (amountY - 1) * 2;

  const position = new Float32Array(amountPoints * 3);
  const normal = new Float32Array(amountPoints * 3);
  const uv = new Float32Array(amountPoints * 2);
  const index = new Uint16Array(amountTriangles * 3);

  let prevZ = 0;
  let _prev = 0;
  let prevY = 0;
  let rotationAcc = 0;

  shape.sort((a, b) => a.y > b.y ? -1 : 1).map(p => {
    return { x: p.x, y: 1 - p.y }
  }).forEach((point, j) => {
    const offset = j * amountX;

    // We rotate around the previous point, so we need to subtract that.
    let resetY = point.y - _prev

    rotationAcc += resetY * yCurvature;

    let [oz, oy] = rotate2D([resetY, 0], rotationAcc);

    const _a = Math.sin(Math.PI * point.y)

    for (let i = 0; i < amountX; i++) {
      const a = 2 - (i / (amountX - 1)) * 2 - 1;

      const curvedX = Math.sin(Math.abs(a) * Math.PI) * 0.01;
      let [z, y] = rotate2D([0.0001, (curvedX * xCurvature) * _a], rotationAcc);

      let x = (Math.min(Math.max(point.x, 0.001), 0.999) - 1) * a * 0.5; // X is left -> right

      // const n = normalize3D([Math.sin(Math.abs(a / 100)), y, z]);
      //
      // normal[offset * 3 + i * 3 + 0] = n[0]
      // normal[offset * 3 + i * 3 + 1] = n[1]
      // normal[offset * 3 + i * 3 + 2] = n[2]

      position[offset * 3 + i * 3 + 0] = x;
      position[offset * 3 + i * 3 + 1] = y + oy + prevY;
      position[offset * 3 + i * 3 + 2] = z + oz + prevZ;

      uv[offset * 2 + i * 2 + 0] = position[offset * 3 + i * 3 + 0] + 1 / 2;
      uv[offset * 2 + i * 2 + 1] = position[offset * 3 + i * 3 + 2];

      // Create the indeces per row
      if (j !== shape.length - 1) {
        const lineOffset = j * (amountX - 1);

        index[lineOffset * 6 + i * 6 + 0] = offset + i + amountX;
        index[lineOffset * 6 + i * 6 + 1] = offset + i + 1;
        index[lineOffset * 6 + i * 6 + 2] = offset + i + 0;

        index[lineOffset * 6 + i * 6 + 3] = offset + i + 1;
        index[lineOffset * 6 + i * 6 + 4] = offset + i + amountX;
        index[lineOffset * 6 + i * 6 + 5] = offset + i + amountX + 1;
      }
    }

    prevY += oy;
    prevZ += oz;
    _prev = point.y;
  });

  return calculateNormals({
    position,
    normal,
    index,
    uv,
  });
}
