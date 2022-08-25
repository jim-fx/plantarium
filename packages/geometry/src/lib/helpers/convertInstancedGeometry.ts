import { hasNaN } from '@plantarium/helpers';
import type { InstancedGeometry, TransferGeometry } from '@plantarium/types';
import { quat, vec3 } from 'gl-matrix';

function applyTransformation(
	geo: TransferGeometry,
	offset: ArrayLike<number> = [0, 0, 0],
	rotation: ArrayLike<number> = [0, 0, 0, 1],
	scale: ArrayLike<number> = [1, 1, 1]
): TransferGeometry {
	const l = geo.position.length;

	const newPos = new Float32Array(geo.position);

	const rot = quat.fromValues(rotation[0], rotation[1], rotation[2], rotation[3]);

	const pos = geo.position;
	for (let i = 0; i < l; i += 3) {
		let p = vec3.fromValues(pos[i], pos[i + 1], pos[i + 2]);
		vec3.multiply(p, p, vec3.fromValues(scale[0], scale[1], scale[2]));
		vec3.transformQuat(p, p, rot);

		//Apply offset
		newPos[i + 0] = p[0] + offset[0];
		newPos[i + 1] = p[1] + offset[1];
		newPos[i + 2] = p[2] + offset[2];
	}

	return {
		position: newPos,
		uv: geo.uv,
		normal: geo.normal,
		index: geo.index
	};
}

export default function convertInstancedGeometry(instance: InstancedGeometry): TransferGeometry[] {
	if (Array.isArray(instance)) return instance.map((i) => convertInstancedGeometry(i)).flat();

	const exp: TransferGeometry[] = [];
	const geometry: TransferGeometry = {
		position: instance.position,
		normal: instance.normal,
		uv: instance.uv,
		index: instance.index
	};

	const offset = instance.offset;
	const rotation = instance.rotation;
	const scale = instance.scale;

	const l = instance.offset.length / 3;
	for (let i = 0; i < l; i++) {
		exp.push(
			applyTransformation(
				geometry,
				offset.slice(i * 3, i * 3 + 3),
				rotation.slice(i * 4, i * 4 + 4),
				scale.slice(i * 3, i * 3 + 3)
			)
		);
	}

	return exp;
}
