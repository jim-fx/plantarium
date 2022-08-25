import { mat3, vec3 } from 'gl-matrix';

export function applyRotationMatrixToVec3(vec: number[], mat: number[]) {
	const v = vec3.fromValues(vec[0], vec[1], vec[2]);

	const m = mat3.fromValues(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5], mat[6], mat[7], mat[8]);

	vec3.transformMat3(v, v, m);

	return [...v];
}
