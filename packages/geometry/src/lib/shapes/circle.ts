import type { Vec3 } from 'ogl';

export default function (
	origin: Vec3 | [number, number, number] = [0, 0, 0],
	radius = 1,
	resolution = 3
) {
	//General parameters
	const positionAmount = (resolution + 1) * 3;
	const angle = (360 * (Math.PI / 180)) / resolution; // Convert to radians
	const startPoint = [origin[0], origin[1], origin[2] + radius];

	//Final model
	const position = new Float32Array(positionAmount);
	const normal = new Float32Array(positionAmount);
	const uv = new Float32Array(resolution * 2);
	const index = new Uint16Array(resolution * 3);

	//Set first point
	position[0] = origin[0];
	position[1] = origin[1];
	position[2] = origin[2];

	for (let i = 1; i <= resolution + 1; i++) {
		const _angle = angle * (i - 1);

		const x =
			Math.cos(_angle) * (startPoint[0] - origin[0]) -
			Math.sin(_angle) * (startPoint[2] - origin[2]) +
			origin[0];
		const y = origin[1];
		const z =
			Math.sin(_angle) * (startPoint[0] - origin[0]) +
			Math.cos(_angle) * (startPoint[2] - origin[2]) +
			origin[2];

		position[i * 3 + 0] = x;
		position[i * 3 + 1] = y;
		position[i * 3 + 2] = z;
	}

	for (let i = 0; i < resolution; i++) {
		if (i === resolution - 1) {
			index[i * 3 + 0] = 0;
			index[i * 3 + 1] = resolution;
			index[i * 3 + 2] = 1;
		} else {
			index[i * 3 + 0] = 0;
			index[i * 3 + 1] = i + 1;
			index[i * 3 + 2] = i + 2;
		}
	}

	return {
		position,
		normal,
		uv,
		index
	};
}
