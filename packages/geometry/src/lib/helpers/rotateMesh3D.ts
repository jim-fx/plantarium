import type { TransferGeometry } from '@plantarium/types';
import type { Vec3 } from 'ogl';
import rotate3D from './rotate3D';

export default function (
	geo: TransferGeometry,
	rawAxis: number[] | Vec3,
	theta: number
): TransferGeometry {
	const newPosition = new Float32Array(geo.position.length);

	const amount = geo.position.length / 3;

	for (let i = 0; i < amount; i++) {
		const rotatedPoint = rotate3D(
			[geo.position[i * 3], geo.position[i * 3 + 1], geo.position[i * 3 + 2]],
			rawAxis,
			theta
		);

		newPosition[i * 3 + 0] = rotatedPoint[0];
		newPosition[i * 3 + 1] = rotatedPoint[1];
		newPosition[i * 3 + 2] = rotatedPoint[2];
	}

	return {
		...geo,
		position: newPosition
	};
}
