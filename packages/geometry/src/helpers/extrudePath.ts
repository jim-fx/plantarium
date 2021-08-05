import { identity, rotate } from 'gl-matrix/mat4';
import {
  add,
  cross,
  dot,
  mul,
  normalize,
  subtract,
  transformMat4,
} from 'gl-matrix/vec3';

function createCircle(res: number) {
  const angle = (2 * Math.PI) / res;

  const position = new Array(res).fill(null).map((_, i) => {
    return [Math.cos(angle * i), Math.sin(angle * i)];
  });

  return position;
}

export default function (path, resolution) {
  const mat = [],
    v = [],
    axis = [];

  const mesh = { position: [], index: [] };

  const position = createCircle(resolution);

  const positionAmount = position.length,
    pathLength = path.length;

  for (let i = 0; i < pathLength; i++) {
    const n = [0, 0, 1];
    if (i === 0) {
      subtract(v, path[i], path[i + 1]);
    } else if (i === pathLength - 1) {
      subtract(v, path[i - 1], path[i]);
    } else {
      subtract(v, path[i - 1], path[i + 1]);
    }
    normalize(v, v);
    cross(axis, n, v);
    const angle = Math.acos(dot(n, v));
    identity(mat);
    rotate(mat, mat, angle, axis);

    for (let j = 0; j < positionAmount; j++) {
      const p = position[j];
      const pt = [p[0], p[1], 0];
      const scale = path[i][3];
      mul(pt, pt, [scale, scale, 1]);
      transformMat4(pt, pt, mat);
      add(pt, pt, path[i]);
      mesh.position.push(pt);
    }
  }

  return mesh;
}
