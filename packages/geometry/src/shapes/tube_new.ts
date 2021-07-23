import { identity, rotate } from 'gl-matrix/mat4';
import {
  add,
  cross,
  dot,
  normalize,
  subtract,
  transformMat4,
} from 'gl-matrix/vec3';

const s = 0.05;

const defaultPositions = [
  [0, 0],
  [-0.06 * s, -0.08 * s],
  [0.06 * s, -0.08 * s],
  [0 * s, -0.2 * s],
  [0.06 * s, -0.08 * s],
  [0.1 * s, 0.03 * s],
  [0.19 * s, -0.06 * s],
  [0.1 * s, 0.03 * s],
  [0 * s, 0.1 * s],
  [0.12 * s, 0.16 * s],
  [0 * s, 0.1 * s],
  [-0.1 * s, 0.03 * s],
  [-0.12 * s, 0.16 * s],
  [-0.1 * s, 0.03 * s],
  [-0.06 * s, -0.08 * s],
  [-0.19 * s, -0.06 * s],
];

const defaultEdges = [
  [0, 1],
  [0, 2],
  [0, 4],
  [0, 5],
  [0, 7],
  [0, 8],
  [0, 10],
  [0, 11],
  [0, 13],
  [0, 14],
  [1, 2],
  [1, 3],
  [2, 3],
  [4, 5],
  [4, 6],
  [5, 6],
  [7, 8],
  [7, 9],
  [8, 9],
  [10, 11],
  [10, 12],
  [11, 12],
  [13, 14],
  [13, 15],
  [14, 15],
];

export default function (
  skeleton: Float32Array,
  resX: number,
): TransferGeometry {
  const mat = [],
    v = [],
    axis = [];

  // skeleton = Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0]);

  const outputVertices = [];
  const outputIndices = [];

  // Path to extrude along
  const path: [number, number, number][] = [];

  //Transform the skeleton into the path
  for (let i = 0; i < skeleton.length / 4; i++) {
    path[i] = [skeleton[i + 0], skeleton[i + 1], skeleton[i + 2]];
  }

  // Input shape as 2D vectors
  const positions = defaultPositions;
  if (!positions) throw new Error('positions not provided');

  // Edges (indices of the input shape)
  const edges = defaultEdges;
  if (!edges) throw new Error('edges not provided');

  const closed = false;

  const positionAmount = positions.length,
    pathAmount = path.length,
    edgeAmount = edges.length;

  for (let i = 0; i < pathAmount; i++) {
    const n = [0, 0, 1];

    if (closed) {
      subtract(
        v,
        path[(i - 1 + pathAmount) % (pathAmount - 1)],
        path[(i + 1) % (pathAmount - 1)],
      );
    } else if (i === 0) {
      subtract(v, path[i], path[i + 1]);
    } else if (i === pathAmount - 1) {
      subtract(v, path[i - 1], path[i]);
    } else {
      subtract(v, path[i - 1], path[i + 1]);
    }

    normalize(v, v);

    cross(axis, n, v);

    const angle = Math.acos(dot(n, v));

    identity(mat);

    rotate(mat, mat, angle, axis);

    // const twist = path[i][3];
    // if (twist) rotate(mat, mat, twist, n);

    for (let j = 0; j < positionAmount; j++) {
      const p = positions[j];
      const pt = [p[0], p[1], p[2] || 0];
      transformMat4(pt, pt, mat);
      add(pt, pt, path[i]);
      outputVertices.push(pt);
    }
  }

  for (let i = 0; i < pathAmount - 1; i++) {
    for (let j = 0; j < edgeAmount; j++) {
      const e = edges[j];
      outputIndices.push([
        i * positionAmount + e[0],
        i * positionAmount + e[1],
        (i + 1) * positionAmount + e[0],
      ]);
      outputIndices.push([
        i * positionAmount + e[1],
        (i + 1) * positionAmount + e[0],
        (i + 1) * positionAmount + e[1],
      ]);
    }
  }

  // if (cells && !closed && opts.startCap !== false && opts.caps !== false) {
  //   for (const i = 0; i < cells.length; i++) {
  //     const c = [],
  //       len = cells[i].length;
  //     for (const j = 0; j < len; j++) {
  //       c.push(cells[i][j]);
  //     }
  //     mesh.cells.push(c);
  //   }
  // }
  // if (cells && !closed && opts.endCap !== false && opts.caps !== false) {
  //   for (const i = 0; i < cells.length; i++) {
  //     const c = [],
  //       len = cells[i].length;
  //     for (const j = 0; j < len; j++) {
  //       c.push(cells[i][j] + (pl - 1) * spl);
  //     }
  //     mesh.cells.push(c);
  //   }
  // }

  // Flatten arrays out
  const position = new Float32Array(outputVertices.length * 3);
  for (let i = 0; i < outputVertices.length; i++) {
    position[i * 4 + 0] = outputVertices[i][0];
    position[i * 4 + 1] = outputVertices[i][1];
    position[i * 4 + 2] = outputVertices[i][2];
  }

  const index = new Uint16Array(outputIndices.length * 3);
  for (let i = 0; i < outputIndices.length; i++) {
    index[i * 4 + 0] = outputIndices[i][0];
    index[i * 4 + 1] = outputIndices[i][1];
    index[i * 4 + 2] = outputIndices[i][2];
  }

  console.log(position, index);

  return {
    position,
    index,
    normal: position,
    uv: position,
  };
}
