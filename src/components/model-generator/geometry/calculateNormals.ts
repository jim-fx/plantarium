import { Vec3 } from "ogl";

export default function(geometry: TransferGeometry): TransferGeometry {
  const position = geometry.position;
  const index = geometry.index;
  const normals = geometry.normal;

  //Calculate normals per face
  //Process 3 vertices at a time
  for (let i = 0; i < index.length / 3; i++) {
    const v1 = new Vec3(position[index[i * 3 + 0] * 3 + 0], position[index[i * 3 + 0] * 3 + 1], position[index[i * 3 + 0] * 3 + 2]);

    const v2 = new Vec3(position[index[i * 3 + 1] * 3 + 0] - v1.x, position[index[i * 3 + 1] * 3 + 1] - v1.y, position[index[i * 3 + 1] * 3 + 2] - v1.z);

    const v3 = new Vec3(position[index[i * 3 + 2] * 3 + 0] - v1.x, position[index[i * 3 + 2] * 3 + 1] - v1.y, position[index[i * 3 + 2] * 3 + 2] - v1.z);

    const normal = new Vec3().cross(v2, v3).normalize();

    for (let j = 0; j < 3; j++) {
      normals[index[i * 3 + j] * 3 + 0] = normal.x;
      normals[index[i * 3 + j] * 3 + 1] = normal.y;
      normals[index[i * 3 + j] * 3 + 2] = normal.z;
    }
  }

  return geometry;
}
