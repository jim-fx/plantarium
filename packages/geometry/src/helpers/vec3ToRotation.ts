import normalize2D from "./normalize2D";
import normalize3D from "./normalize3D"

function vec2Angle(a, b) {
  return Math.atan2(a[1] * b[0] - a[0] * b[1], a[0] * b[0] + a[1] * b[1]);
}

export function vec3ToRotation([x, y, z]: [number, number, number]) {


  // atan2(a.y*b.x−a.x*b.y,a.x*b.x+a.y*b.y)
  const xAngle = vec2Angle([0, 1], normalize2D([x, y]));
  const yAngle = vec2Angle([1, 0], normalize2D([x, z]));
  const zAngle = vec2Angle([0, 1], normalize2D([y, z]));

  // arccos[(xa * xb + ya * yb) / (√(xa2 + ya2) * √(xb2 + yb2))]

  return [xAngle, yAngle, zAngle]
}
