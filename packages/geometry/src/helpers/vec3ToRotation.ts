function vec2Angle(a: [number, number], b: number[]) {
  return Math.atan2(a[1] * b[0] - a[0] * b[1], a[0] * b[0] + a[1] * b[1]);
}

export function vec3ToRotation([x, y, z]: number[]) {

  const xAngle = vec2Angle([0, 1], [z, y]);
  const yAngle = vec2Angle([0, 1], [x, z]);
  const zAngle = vec2Angle([0, 1], [x, y]);

  return [xAngle, yAngle, zAngle]
}
