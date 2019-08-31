import { Vec3 } from "ogl";

/*
  Javascript version of:  
  http://paulbourke.net/geometry/rotate/source.c
  
*/

/*
   Rotate a point p by angle theta around an arbitrary axis r
   Return the rotated point.
   Positive angles are anticlockwise looking down the axis
   towards the origin.
   Assume right hand coordinate system.
*/

export default function arbitraryRotate(p: Vec3, theta: number, r: Vec3) {
  const q = new Vec3(0, 0, 0);
  let costheta: number;
  let sintheta: number;

  r.normalize();
  costheta = Math.cos(theta);
  sintheta = Math.sin(theta);

  q[0] += (costheta + (1 - costheta) * r[0] * r[0]) * p[0];
  q[0] += ((1 - costheta) * r[0] * r[1] - r[2] * sintheta) * p[1];
  q[0] += ((1 - costheta) * r[0] * r[2] + r[1] * sintheta) * p[2];

  q[1] += ((1 - costheta) * r[0] * r[1] + r[2] * sintheta) * p[0];
  q[1] += (costheta + (1 - costheta) * r[1] * r[1]) * p[1];
  q[1] += ((1 - costheta) * r[1] * r[2] - r[0] * sintheta) * p[2];

  q[2] += ((1 - costheta) * r[0] * r[2] - r[1] * sintheta) * p[0];
  q[2] += ((1 - costheta) * r[1] * r[2] + r[0] * sintheta) * p[1];
  q[2] += (costheta + (1 - costheta) * r[2] * r[2]) * p[2];

  return q;
}
