export default function (...geometries: TransferGeometry[]): TransferGeometry {
  if (geometries.length === 1) {
    return geometries[0];
  }

  console.log('JOIN', geometries);

  const position = new Float32Array(
    geometries.reduce((a, b) => a + b.position.length, 0),
  );
  const normal = new Float32Array(
    geometries.reduce((a, b) => a + b.normal.length, 0),
  );
  const uv = new Float32Array(geometries.reduce((a, b) => a + b.uv.length, 0));
  const indexSize = geometries.reduce((a, b) => a + b.index.length, 0);
  const index =
    indexSize > 65536 ? new Uint32Array(indexSize) : new Uint16Array(indexSize);

  let posOffset = 0;
  let normalOffset = 0;
  let uvOffset = 0;
  let indexOffset = 0;

  for (let i = 0; i < geometries.length; i++) {
    //Copy normal array
    const _normal = geometries[i].normal;
    const normalLength = _normal.length;
    for (let j = 0; j < normalLength; j++) {
      normal[normalOffset + j] = _normal[j];
    }
    normalOffset += normalLength;

    //Copy uv array
    const _uv = geometries[i].uv;
    const uvLength = _uv.length;
    for (let j = 0; j < uvLength; j++) {
      uv[uvOffset + j] = _uv[j];
    }
    uvOffset += uvLength;

    //Transfer index
    const _index = geometries[i].index;
    const indexLength = _index.length;
    for (let j = 0; j < indexLength; j++) {
      index[j + indexOffset] = _index[j] + posOffset / 3;
    }
    indexOffset += indexLength;

    //Copy position array
    const _pos = geometries[i].position;
    const posLength = _pos.length;
    for (let j = 0; j < posLength; j++) {
      position[posOffset + j] = _pos[j];
    }
    posOffset += posLength;
  }

  return {
    position,
    normal,
    uv,
    index,
  };
}
