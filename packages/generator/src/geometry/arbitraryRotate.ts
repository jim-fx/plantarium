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

export default function arbitraryRotate(point: Vec3 | number[], theta: number, axis: Vec3) {
  axis.normalize();

  const costheta = Math.cos(theta);
  const sintheta = Math.sin(theta);

  return new Vec3(
    (costheta + (1 - costheta) * axis[0] * axis[0]) * point[0] +
      ((1 - costheta) * axis[0] * axis[1] - axis[2] * sintheta) * point[1] +
      ((1 - costheta) * axis[0] * axis[2] + axis[1] * sintheta) * point[2],

    ((1 - costheta) * axis[0] * axis[1] + axis[2] * sintheta) * point[0] +
      (costheta + (1 - costheta) * axis[1] * axis[1]) * point[1] +
      ((1 - costheta) * axis[1] * axis[2] - axis[0] * sintheta) * point[2],

    ((1 - costheta) * axis[0] * axis[2] - axis[1] * sintheta) * point[0] +
      ((1 - costheta) * axis[1] * axis[2] + axis[0] * sintheta) * point[1] +
      (costheta + (1 - costheta) * axis[2] * axis[2]) * point[2]
  );
}
