// def rotation_matrix_from_vectors(vec1, vec2):
//     """ Find the rotation matrix that aligns vec1 to vec2
//     :param vec1: A 3d "source" vector
//     :param vec2: A 3d "destination" vector
//     :return mat: A transform matrix (3x3) which when applied to vec1, aligns it with vec2.
//     """
//     a, b = (vec1 / np.linalg.norm(vec1)).reshape(3), (vec2 / np.linalg.norm(vec2)).reshape(3)
//     v = np.cross(a, b)
//     c = np.dot(a, b)
//     s = np.linalg.norm(v)
//     kmat = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
//     rotation_matrix = np.eye(3) + kmat + kmat.dot(kmat) * ((1 - c) / (s ** 2))
//     return rotation_matrix

import { mat3, mat4, vec3 } from 'gl-matrix';

export function rotationMatrixFromVectors(v1: number[], v2: number[]) {
	const a = vec3.fromValues(v1[0], v1[1], v1[2]);
	const b = vec3.fromValues(v2[0], v2[1], v2[2]);

	const forwardVector = vec3.create();
	vec3.subtract(forwardVector, b, a);
	vec3.normalize(forwardVector, forwardVector);
	const upVector = vec3.fromValues(0, 1, 0);

	const rightVector = vec3.create();
	vec3.cross(rightVector, forwardVector, upVector);
	vec3.normalize(rightVector, rightVector);

	return [
		rightVector[0],
		rightVector[1],
		rightVector[2],
		upVector[0],
		upVector[1],
		upVector[2],
		forwardVector[0],
		forwardVector[1],
		forwardVector[2]
	];
}
