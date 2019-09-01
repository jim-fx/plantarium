let s: Float32Array[];

const draw = function(...points: number[]) {
  s.push(new Float32Array(points.flat()));
};

draw.setSkeleton = function(_s: Float32Array[]) {
  s = _s;
};

export default draw;
