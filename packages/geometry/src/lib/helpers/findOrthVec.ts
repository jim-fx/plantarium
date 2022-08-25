export function findOrthogonalVector([x, y, z]: number[]) {
	if (x === 0 && z === 0) {
		return [1, 0, 0];
	}
	return [1, 1, -((x + y) / z)];
}
