export function length2D([x, y]: [number, number]) {
	return Math.sqrt(x * x + y * y);
}

export function length3D([x, y, z]: number[]) {
	return Math.sqrt(x * x + y * y + z * z);
}
