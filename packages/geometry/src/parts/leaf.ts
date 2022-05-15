import type { TransferGeometry, Vec2 } from "@plantarium/types";

export default function(
  shape: Vec2[],
  { res = 1, xCurvature = 0.5, yCurvature = 0.2 } = {},
): TransferGeometry {
  const amountY = shape.length;
  const amountX = 3 + res * 2;
  const amountPoints = amountX * amountY;

  const amountTriangles = (amountX - 1) * (amountY - 1) * 2;

  const position = new Float32Array(amountPoints * 3);
  const normal = new Float32Array(amountPoints * 2);
  const uv = new Float32Array(amountPoints * 2);
  const index = new Uint16Array(amountTriangles * 3);

  shape.forEach((s, j) => {
    const offset = j * amountX;

    // Do the left side of the leaf;
    for (let i = 0; i < amountX; i++) {
      const a = 2 - (i / (amountX - 1)) * 2 - 1;
      position[offset * 3 + i * 3 + 0] = (s.x - 1) * a * 0.5;

      const curvedY = -(1 - s.y) * (1 - s.y) * 0.5;
      const curvedX = Math.sin(Math.abs(a) * Math.PI) * 0.01;

      position[offset * 3 + i * 3 + 1] =
        curvedX * xCurvature + curvedY * yCurvature;
      position[offset * 3 + i * 3 + 2] = s.y - 1;

      uv[offset * 2 + i * 2 + 0] = position[offset * 3 + i * 3 + 0] + 1 / 2;
      uv[offset * 2 + i * 2 + 1] = position[offset * 3 + i * 3 + 2];

      // Create the indeces per row
      if (j < shape.length - 1) {
        const lineOffset = j * (amountX - 1);

        index[lineOffset * 6 + i * 6 + 0] = offset + i + 0;
        index[lineOffset * 6 + i * 6 + 1] = offset + i + 1;
        index[lineOffset * 6 + i * 6 + 2] = offset + i + amountX;

        index[lineOffset * 6 + i * 6 + 3] = offset + i + 1;
        index[lineOffset * 6 + i * 6 + 4] = offset + i + amountX;
        index[lineOffset * 6 + i * 6 + 5] = offset + i + amountX + 1;
      }
    }
  });

  // console.table(groupArray(index, 3));

  return {
    position,
    normal,
    index,
    uv,
  };
}
