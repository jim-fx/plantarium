const totalSize = 100;
const slopeLength = 2;
const groundHeight = 1;

export default function (size = 1, res = 12, resCircle = 12): TransferGeometry {
  //General parameters
  const angle = (360 * (Math.PI / 180)) / resCircle; // Convert to radians

  // Plus one for center vertext
  const amountPositions = res * resCircle + 1;

  const amountTriangles = (res - 1) * resCircle * 2 + resCircle;

  //Final model
  const position = new Float32Array(amountPositions * 3);
  const normal = new Float32Array(amountPositions * 3);
  const uv = new Float32Array(amountPositions * 2);
  const index = new Uint16Array(amountTriangles * 3);

  //Set first point
  position[0] = 0;
  position[1] = 1 - groundHeight;
  position[2] = 0;

  normal[0] = 0;
  normal[1] = 1;
  normal[2] = 0;

  uv[0] = 0.5;
  uv[1] = 0.5;

  //Create the positions
  const xPositions = new Array(res - 1)
    .fill(null)
    .map((v, i, a) => size + (i / (a.length - 1)) * slopeLength);

  xPositions.push(totalSize);

  const yPositions = xPositions.map((v) => {
    const slopeAlpha =
      (Math.max(Math.min(v, size + slopeLength), size) - size) / slopeLength;
    return Math.sin((slopeAlpha + 0.5) * Math.PI) / 2 + 0.5 - groundHeight;
  });

  //Loop from center out
  for (let i = 0; i < res; i++) {
    const xPos = xPositions[i];
    const yPos = yPositions[i];

    for (let j = 0; j < resCircle; j++) {
      const _angle = angle * j;

      const x = Math.cos(_angle) * xPos;
      const y = yPos;
      const z = Math.sin(_angle) * xPos;

      const lineOffset = i * resCircle;
      // We need to offset plus to account for the center vertices
      const offset = lineOffset + j + 1;

      position[offset * 3 + 0] = x;
      position[offset * 3 + 1] = y;
      position[offset * 3 + 2] = z;

      normal[offset * 3 + 0] = 0;
      normal[offset * 3 + 1] = 1;
      normal[offset * 3 + 2] = 0;

      uv[offset * 2 + 0] = x;
      uv[offset * 2 + 1] = z;

      if (i === 0) {
        const _offset = (offset - 1) * 3;

        index[_offset + 0] = 0;
        index[_offset + 1] = ((j + 1) % resCircle) + 1;
        index[_offset + 2] = j + 1;
      } else if (j === resCircle - 1) {
        const _offset = i * resCircle * 6 + j * 6 - resCircle * 3;

        index[_offset + 0] = offset;
        index[_offset + 1] = offset + 1 - resCircle - resCircle;
        index[_offset + 2] = offset + 1 - resCircle;

        index[_offset + 3] = offset;
        index[_offset + 4] = offset - resCircle;
        index[_offset + 5] = offset + 1 - resCircle * 2;
      } else {
        // For the outer rings we need to create two facecs per point
        // const _offset = lineOffset;
        const _offset = i * resCircle * 6 + j * 6 - resCircle * 3;

        index[_offset + 0] = offset;
        index[_offset + 1] = offset + 1 - resCircle;
        index[_offset + 2] = offset + 1;

        index[_offset + 3] = offset;
        index[_offset + 4] = offset - resCircle;
        index[_offset + 5] = offset + 1 - resCircle;
      }

      // Two triangles per vertice
    }
  }

  return {
    position,
    normal,
    uv,
    index,
  };
}
