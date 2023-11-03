import { noise } from '../helpers';

export function noiseSkeleton(
	skeleton: Float32Array,
	strength: ((a: number) => number) | number = 1,
	scale: [number, number, number] | number = 1,
	offset: [number, number, number] | number = 0,
	fixateBottom = true
) {
	const _s = Array.isArray(scale) ? 1 : scale;
	const scaleX = (scale[0] ?? _s) * 10;
	const scaleY = (scale[1] ?? _s) * 10;
	const scaleZ = (scale[2] ?? _s) * 10;

	const _o = Array.isArray(offset) ? 0 : offset;
	const offsetX = offset[0] ?? _o;
	const offsetY = offset[1] ?? _o;
	const offsetZ = offset[2] ?? _o;

	const pathLength = skeleton.length / 4;

	const lastVec = [skeleton[0], skeleton[1], skeleton[2]];
	let distance = 0;
const getStrength = typeof strength === "function" ? strength : () => strength;

	for (let i = 0; i < pathLength; i++) {
		const a = i / pathLength;

		distance +=
			(Math.abs(lastVec[0] - skeleton[i * 4 + 0]) +
				Math.abs(lastVec[1] - skeleton[i * 4 + 1]) +
				Math.abs(lastVec[2] - skeleton[i * 4 + 2])) /
			3;

		lastVec[0] = skeleton[i * 4 + 0];
		lastVec[1] = skeleton[i * 4 + 1];
		lastVec[2] = skeleton[i * 4 + 2];

		const _s = fixateBottom ? getStrength(a) * a : getStrength(a);

		const [x, y, z] = skeleton.slice(i * 4, i * 4 + 3);

		// skeleton[i * 4 + 0] = x + noise.n3d(x * scaleX, y, distance) * _s;
		// skeleton[i * 4 + 1] = y + noise.n3d(distance, y * scaleY, z) * _s;
		// skeleton[i * 4 + 2] = z + noise.n3d(x, distance, z * scaleZ) * _s;

		skeleton[i * 4 + 0] = x + noise.n1d(1000 + offsetX + distance * scaleX) * _s;
		skeleton[i * 4 + 1] = y + noise.n1d(2000 + offsetY + distance * scaleY) * _s;
		skeleton[i * 4 + 2] = z + noise.n1d(3000 + offsetZ + distance * scaleZ) * _s;
	}

	return skeleton;
}
