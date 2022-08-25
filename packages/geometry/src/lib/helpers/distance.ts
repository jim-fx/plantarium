import { length3D } from './length';
import { subtract3D } from './subtract';

export function distance3D(a: Iterable<number>, b: Iterable<number>) {
	return length3D(subtract3D(a, b));
}
