import interpolateSkeleton from './interpolateSkeleton';

export default function (skeleton: Float32Array, alpha: number): [number, number, number, number] {
	const amount = skeleton.length / 4;

	const endAlpha = 1 + (amount - 1) * alpha;
	const startAlpha = endAlpha - 1;

	const p1 = interpolateSkeleton(skeleton, startAlpha / amount);
	const p2 = interpolateSkeleton(skeleton, endAlpha / amount);

	return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2], p2[3] + p1[3] / 2];
}
