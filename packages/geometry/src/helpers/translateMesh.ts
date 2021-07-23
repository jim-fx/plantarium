import type { Vec3 } from 'ogl';

export default function (
  mesh: TransferGeometry,
  offset: Vec3,
): TransferGeometry {
  const amount = mesh.position.length / 3;

  for (let i = 0; i < amount; i++) {
    mesh.position[i * 3 + 0] += offset[0];
    mesh.position[i * 3 + 1] += offset[1];
    mesh.position[i * 3 + 2] += offset[2];
  }

  return mesh;
}
