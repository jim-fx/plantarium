import { identity, rotate } from 'gl-matrix/mat4';
import {
  add,
  cross,
  dot,
  normalize,
  subtract,
  transformMat4,
} from 'gl-matrix/vec3';
import type { Vec3 } from 'ogl';
import { circle } from '../shapes';
import flatten from './flatten';

const mat = [],
  v = [],
  axis = [];

const defaultPositions = [
  [-0.1, -0.1],
  [0, 0.1],
  [0.1, -0.1],
];

const defaultEdges = [
  [0, 1],
  [1, 2],
  [2, 0],
];

const c = flatten(circle([0, 0, 0] as Vec3, 0.1, 8));

const useDefault = false;

export default function ({
  path,
  positions = useDefault ? defaultPositions : [...c.position],
  edges = useDefault ? defaultEdges : [...c.index],
  closed = true,
}) {
  const mesh = { position: [], index: [] };

  // Convert positions from [x,y,z,x,y,z] to [[x,y,z],[x,y,z]]
  if (!Array.isArray(positions[0])) {
    const _pos = [];
    const amount = positions.length / 2;
    for (let i = 0; i < amount; i++) {
      _pos.push([positions[i * 2 + 0], positions[i * 2 + 1]]);
    }
    positions = _pos;
  }

  // Convert indeces from [i1,i2, i1,, i2] to [[i1, i2], [i1, i2]]
  if (!Array.isArray(edges[0])) {
    const _edge = [];
    const amount = edges.length / 2;
    for (let i = 0; i < amount; i++) {
      _edge.push([edges[i * 2 + 0], edges[i * 2 + 1]]);
    }
    edges = _edge;
  }

  if (!positions) throw new Error('positions not provided');
  if (!edges) throw new Error('edges not provided');

  const spl = positions.length,
    pl = path.length,
    sel = edges.length;
  for (let i = 0; i < pl; i++) {
    const n = [0, 0, 1];
    if (closed) {
      subtract(v, path[(i - 1 + pl) % (pl - 1)], path[(i + 1) % (pl - 1)]);
    } else if (i === 0) {
      subtract(v, path[i], path[i + 1]);
    } else if (i === pl - 1) {
      subtract(v, path[i - 1], path[i]);
    } else {
      subtract(v, path[i - 1], path[i + 1]);
    }
    normalize(v, v);
    cross(axis, n, v);
    const angle = Math.acos(dot(n, v));
    identity(mat);
    rotate(mat, mat, angle, axis);
    const twist = path[i][3];
    if (twist) rotate(mat, mat, twist, n);
    for (let j = 0; j < spl; j++) {
      const p = positions[j];
      const pt = [p[0], p[1], p[2] || 0];
      transformMat4(pt, pt, mat);
      add(pt, pt, path[i]);
      mesh.position.push(pt);
    }
  }
  for (let i = 0; i < pl - 1; i++) {
    for (let j = 0; j < sel; j++) {
      const e = edges[j];
      mesh.index.push([i * spl + e[0], i * spl + e[1], (i + 1) * spl + e[0]]);
      mesh.index.push([
        i * spl + e[1],
        (i + 1) * spl + e[0],
        (i + 1) * spl + e[1],
      ]);
    }
  }
  // if (cells && !closed && startCap !== false && caps !== false) {
  //   for (let i = 0; i < cells.length; i++) {
  //     const c = [],
  //       len = cells[i].length;
  //     for (let j = 0; j < len; j++) {
  //       c.push(cells[i][j]);
  //     }
  //     mesh.cells.push(c);
  //   }
  // }
  // if (cells && !closed && endCap !== false && caps !== false) {
  //   for (let i = 0; i < cells.length; i++) {
  //     const c = [],
  //       len = cells[i].length;
  //     for (let j = 0; j < len; j++) {
  //       c.push(cells[i][j] + (pl - 1) * spl);
  //     }
  //     mesh.cells.push(c);
  //   }
  // }
  return mesh;
}
