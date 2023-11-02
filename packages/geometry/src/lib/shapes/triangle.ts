import { Vec3 } from 'ogl';

export default function (origin: Vec3 = new Vec3(0, 0, 0), size = 1) {
  //Final model
  const position = new Float32Array(9);
  const normal = new Float32Array(9);
  const uv = new Float32Array(6);
  const index = new Uint16Array(3);

  position[0] = origin[0];
  position[1] = origin[1];
  position[2] = origin[2] - size;

  position[3] = origin[0] + size;
  position[4] = origin[1];
  position[5] = origin[2] + size;

  position[6] = origin[0] - size;
  position[7] = origin[1];
  position[8] = origin[2] + size;

  normal[0] = 0;
  normal[1] = 1;
  normal[2] = 0;

  normal[3] = 0;
  normal[4] = 1;
  normal[5] = 0;

  normal[6] = 0;
  normal[7] = 1;
  normal[8] = 0;

  uv[0] = 0.5;
  uv[1] = 1;

  uv[2] = 1;
  uv[3] = 0;

  uv[4] = 0;
  uv[5] = 0;

  index[0] = 0;
  index[1] = 2;
  index[2] = 1;

  return {
    position,
    normal,
    uv,
    index
  };
}
