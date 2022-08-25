import type { TransferGeometry } from '@plantarium/types';

export default function (size = 2, res = 3): TransferGeometry {
	const amountPoints = res * 4 - 4;

	if (res < 2) res = 2;

	const position = new Float32Array(amountPoints * 3);
	const normal = new Float32Array(amountPoints * 3);
	const uv = new Float32Array(amountPoints * 3);
	const index = new Uint16Array(res * 4);

	for (let i = 0; i < res; i++) {
		let x = (i / (res - 1) - 0.5) * size * 2;

		// Bottom line
		position[i * 3 + 0] = x;
		position[i * 3 + 1] = 0;
		position[i * 3 + 2] = -size;

		// Top Line
		const topLineOffset = (res * 2 - 2) * 3;
		position[i * 3 + topLineOffset + 0] = -x;
		position[i * 3 + topLineOffset + 1] = 0;
		position[i * 3 + topLineOffset + 2] = size;

		if (i < res - 2) {
			// Left line
			const leftLineOffset = res * 3;
			position[leftLineOffset + 0 + i * 3] = size;
			position[leftLineOffset + 1 + i * 3] = 0;
			position[leftLineOffset + 2 + i * 3] = x + (size * 2) / (res - 1);
		}

		if (i < res - 1) {
			const rightLineOffset = (res * 3 - 3) * 3;
			position[i * 3 + rightLineOffset + 0] = -size;
			position[i * 3 + rightLineOffset + 1] = 0;
			position[i * 3 + rightLineOffset + 2] = -x;
		}

		index[i * 2] = i;
		index[i * 2 + 1] = res * 3 - 3 - i;
		index[i * 2 + res * 2 + 0] = i + res - 1;
		index[i * 2 + res * 2 + 1] = (amountPoints - i) % amountPoints;
	}

	return {
		position,
		normal,
		uv,
		index
	};
}
