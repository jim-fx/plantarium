import { Vec3 } from 'ogl-typescript';
// import length3D from './length3D';
import { normalize3D } from './normalize';

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

export default function rotate3D(point: number[] | Vec3, rawAxis: number[] | Vec3, theta: number) {
	const [px, py, pz] = point;
	const [ax, ay, az] = normalize3D(rawAxis);

	const costheta = Math.cos(theta);
	const sintheta = Math.sin(theta);

	return new Vec3(
		(costheta + (1 - costheta) * ax * ax) * px +
			((1 - costheta) * ax * ay - az * sintheta) * py +
			((1 - costheta) * ax * az + ay * sintheta) * pz,

		((1 - costheta) * ax * ay + az * sintheta) * px +
			(costheta + (1 - costheta) * ay * ay) * py +
			((1 - costheta) * ay * az - ax * sintheta) * pz,

		((1 - costheta) * ax * az - ay * sintheta) * px +
			((1 - costheta) * ay * az + ax * sintheta) * py +
			(costheta + (1 - costheta) * az * az) * pz
	);
}
