import { box } from "@plantarium/geometry";
import { Vec3 } from "ogl-typescript";
import { typeCheckNode } from "../types";


export default typeCheckNode({
  title: 'Model',
  type: 'model',
  outputs: ['model'],

  meta: {
    description: `Creates a 3D model`
  },

  parameters: {
    type: {
      internal: true,
      type: "select",
      values: ["sphere", "box"],
      value: "sphere"
    },
    size: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
  },

  compute(parameters, _, alpha) {

    const type = parameters.type;
    const radius = parameters.size(alpha)

    if (type === "sphere") {


      const wSegs = 16;
      const hSegs = Math.ceil(wSegs * 0.5);
      const pStart = 0;
      const pLength = Math.PI * 2;
      const tStart = 0;
      const tLength = Math.PI;

      const num = (wSegs + 1) * (hSegs + 1);
      const numIndices = wSegs * hSegs * 6;

      const position = new Float32Array(num * 3);
      const normal = new Float32Array(num * 3);
      const uv = new Float32Array(num * 2);
      const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);

      let i = 0;
      let iv = 0;
      let ii = 0;
      let te = tStart + tLength;
      const grid = [];

      let n = new Vec3();

      for (let iy = 0; iy <= hSegs; iy++) {
        let vRow = [];
        let v = iy / hSegs;
        for (let ix = 0; ix <= wSegs; ix++, i++) {
          let u = ix / wSegs;
          let x = -radius * Math.cos(pStart + u * pLength) * Math.sin(tStart + v * tLength);
          let y = radius * Math.cos(tStart + v * tLength);
          let z = radius * Math.sin(pStart + u * pLength) * Math.sin(tStart + v * tLength);

          position[i * 3] = x;
          position[i * 3 + 1] = y;
          position[i * 3 + 2] = z;

          n.set(x, y, z).normalize();
          normal[i * 3] = n.x;
          normal[i * 3 + 1] = n.y;
          normal[i * 3 + 2] = n.z;

          uv[i * 2] = u;
          uv[i * 2 + 1] = 1 - v;

          vRow.push(iv++);
        }

        grid.push(vRow);
      }

      for (let iy = 0; iy < hSegs; iy++) {
        for (let ix = 0; ix < wSegs; ix++) {
          let a = grid[iy][ix + 1];
          let b = grid[iy][ix];
          let c = grid[iy + 1][ix];
          let d = grid[iy + 1][ix + 1];

          if (iy !== 0 || tStart > 0) {
            index[ii * 3] = a;
            index[ii * 3 + 1] = b;
            index[ii * 3 + 2] = d;
            ii++;
          }
          if (iy !== hSegs - 1 || te < Math.PI) {
            index[ii * 3] = b;
            index[ii * 3 + 1] = c;
            index[ii * 3 + 2] = d;
            ii++;
          }
        }
      }

      return { uv, normal, index, position }

    }



    return box(radius)
  }
}
)
