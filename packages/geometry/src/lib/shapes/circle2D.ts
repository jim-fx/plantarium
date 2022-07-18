export default function (radius: number, resolution = 3) {
  //General parameters
  const positionAmount = resolution * 2;
  const angle = (360 * (Math.PI / 180)) / resolution; // Convert to radians
  const startPoint = [0, 0, radius];

  //Final model
  const position = new Float32Array(positionAmount);
  const normal = new Float32Array(positionAmount);
  const uv = new Float32Array(resolution * 2);
  const index = new Uint16Array(resolution * 3);

  //Set first point
  position[0] = 0;
  position[1] = 0;

  for (let i = 0; i <= resolution; i++) {
    const _angle = angle * i;

    const x =
      Math.cos(_angle) * startPoint[0] - Math.sin(_angle) * startPoint[2];
    const y =
      Math.sin(_angle) * startPoint[0] + Math.cos(_angle) * startPoint[2];

    position[i * 2 + 0] = x;
    position[i * 2 + 1] = y;
  }

  for (let i = 0; i < resolution; i++) {
    if (i < resolution - 1) {
      index[i * 2 + 0] = 0;
      index[i * 2 + 2] = i + 1;
    } else {
      index[i * 2 + 0] = 0;
      index[i * 2 + 2] = i + 1;
    }
  }

  return {
    position,
    normal,
    uv,
    index,
  };
}
