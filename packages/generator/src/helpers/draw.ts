import { Vec3 } from "ogl";

let s: Float32Array[];

const draw = function(...points: (Vec3 | number[])[]) {
  s.push(new Float32Array(points.flat()));
};

draw.setSkeleton = function(_s: Float32Array[]) {
  s = _s;
};

export default draw;
