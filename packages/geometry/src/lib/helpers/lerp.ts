export function lerp(v0: number, v1: number, t: number) {
	return v0 * (1 - t) + v1 * t;
}

export function lerp2D([x1, y1]: Iterable<number>, [x2, y2]: Iterable<number>, a: number) {
	return [lerp(x1, x2, a), lerp(y1, y2, a)];
}

export function lerp3D([x1, y1, z1]: Iterable<number>, [x2, y2, z2]: Iterable<number>, a: number) {
	return [lerp(x1, x2, a), lerp(y1, y2, a), lerp(z1, z2, a)];
}

export function lerp4D(
	[x1, y1, z1, w1]: Iterable<number>,
	[x2, y2, z2, w2]: Iterable<number>,
	a: number
): [number, number, number, number] {
	return [lerp(x1, x2, a), lerp(y1, y2, a), lerp(z1, z2, a), lerp(w1, w2, a)];
}
