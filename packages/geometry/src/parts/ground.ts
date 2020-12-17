const totalSize = 102;
const slopeLength = 2;
const groundHeight = 1;

export default function (size: number, resX = 12, resY = 12): TransferGeometry {
  //General parameters
  const angle = (360 * (Math.PI / 180)) / resY; // Convert to radians

  //Final model
  const position = new Float32Array(resX * resY * 3 + 3);
  const normal = new Float32Array(resX * resY * 3 + 3);
  const uv = new Float32Array(resX * resY * 2);
  const index = new Uint16Array(resX * resY * 6 - resY * 3);

  //Set first point
  position[0] = 0;
  position[1] = 1 - groundHeight;
  position[2] = 0;

  normal[0] = 0;
  normal[1] = 1;
  normal[2] = 0;

  uv[0] = 0;
  uv[1] = 0;

  //Create the positions
  const xPositions = new Array(resX - 1)
    .fill(null)
    .map((v, i, a) => size + (i / (a.length - 1)) * slopeLength);

  xPositions.push(totalSize);

  const yPositions = xPositions.map((v) => {
    const slopeAlpha =
      (Math.max(Math.min(v, size + slopeLength), size) - size) / slopeLength;
    return Math.sin((slopeAlpha + 0.5) * Math.PI) / 2 + 0.5 - groundHeight;
  });

  //Loop from center out
  for (let i = 0; i <= resX; i++) {
    const xPos = xPositions[i];
    const yPos = yPositions[i];

    for (let j = 0; j < resY; j++) {
      const _angle = angle * j;

      const x = Math.cos(_angle) * xPos;
      const y = yPos;
      const z = Math.sin(_angle) * xPos;

      const offset = 3 + i * resY * 3 + j * 3;

      position[offset + 0] = x;
      position[offset + 1] = y;
      position[offset + 2] = z;

      normal[offset + 0] = 0;
      normal[offset + 1] = 1;
      normal[offset + 2] = 0;

      const uvOffset = 2 + i * resY * 2 + j * 2;
      uv[uvOffset + 0] = x;
      uv[uvOffset + 1] = z;
    }
  }

  //Create the indeces;

  //For the center circle
  for (let i = 0; i < resY; i++) {
    if (i === resY - 1) {
      index[(resY - 1) * 3 + 0] = 0;
      index[(resY - 1) * 3 + 1] = 1;
      index[(resY - 1) * 3 + 2] = resY;
    } else {
      index[i * 3 + 0] = i + 0;
      index[i * 3 + 1] = i + 1;
      index[i * 3 + 2] = i + 2;
    }
  }

  for (let i = 0; i < resX; i++) {
    const indexOffset = resY * 3 + i * resY * 6;
    const positionOffset = 1 + i * resY;
    for (let j = 0; j < resY; j++) {
      const _indexOffset = indexOffset + j * 6;
      const _positionOffset = positionOffset + j;
      if (j === resY - 1) {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset - resY + 1;
        index[_indexOffset + 2] = _positionOffset + 1;

        index[_indexOffset + 3] = _positionOffset + 1;
        index[_indexOffset + 4] = _positionOffset + resY;
        index[_indexOffset + 5] = _positionOffset;
      } else {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset + 1;
        index[_indexOffset + 2] = _positionOffset + resY + 1;

        index[_indexOffset + 3] = _positionOffset + resY + 1;
        index[_indexOffset + 4] = _positionOffset + resY;
        index[_indexOffset + 5] = _positionOffset;
      }
    }
  }

  return {
    position,
    normal,
    uv,
    index,
  };
}
