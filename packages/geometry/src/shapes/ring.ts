import { Vec3 } from 'ogl';
import rotate3D from '../helpers/rotate3D';

function getStart(origin: Vec3, axis: Vec3): Vec3 {
  if (origin[0] === 0 && origin[2] === 0) {
    return new Vec3(0, 0, 1);
  } else {
    return new Vec3().cross(origin, axis).normalize();
  }
}

export default function (
  origin: Vec3,
  axis: Vec3,
  radius: number,
  resolution = 3,
  testVec?: Vec3,
): Float32Array {
  axis.normalize();

  //General parameters
  const positionAmount = resolution * 3;
  const angle = (360 * (Math.PI / 180)) / resolution; // Convert to radians

  //Final model
  const position = new Float32Array(positionAmount);

  const x = origin[0];
  const y = origin[1];
  const z = origin[2];

  const start = getStart(origin, axis).multiply(radius);

  for (let i = 0; i < resolution; i++) {
    const _angle = angle * i;
    const v = rotate3D(start, testVec || axis, _angle);

    position[i * 3 + 0] = x + v[0];
    position[i * 3 + 1] = y + v[1];
    position[i * 3 + 2] = z + v[2];
  }

  return position;
}
