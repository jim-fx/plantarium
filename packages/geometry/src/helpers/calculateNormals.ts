import { Vec3 } from 'ogl-typescript';

let lastNormal: Vec3;

export default function (geometry: TransferGeometry): TransferGeometry {
  const position = geometry.position;
  const index = geometry.index;
  const normals = geometry.normal;

  //Calculate normals per face
  //Process 3 vertices at a time

  /*let vA, vB, vC;
  const cb = new Vec3();
  const ab = new Vec3();

  const fl = index.length / 9;
  for (let f = 0; f < fl; f++) {
    vA = new Vec3(position[index[f * 9 + 0]], position[index[f * 9 + 1]], position[index[f * 9 + 2]]);

    vB = new Vec3(position[index[f * 9 + 3]], position[index[f * 9 + 4]], position[index[f * 9 + 5]]);

    vC = new Vec3(position[index[f * 9 + 6]], position[index[f * 9 + 7]], position[index[f * 9 + 8]]);


    cb.cross(vC.sub(vB), vA.sub(vB));

    normals[index[f * 9 + 0]] = cb[0];
    normals[index[f * 9 + 1]] = cb[1];
    normals[index[f * 9 + 2]] = cb[2];

    normals[index[f * 9 + 3]] = cb[3];
    normals[index[f * 9 + 4]] = cb[4];
    normals[index[f * 9 + 5]] = cb[5];

    normals[index[f * 9 + 6]] = cb[6];
    normals[index[f * 9 + 7]] = cb[7];
    normals[index[f * 9 + 8]] = cb[8];
  }*/

  for (let i = 0; i < index.length / 3; i++) {
    const v1 = new Vec3(
      position[index[i * 3 + 0] * 3 + 0],
      position[index[i * 3 + 0] * 3 + 1],
      position[index[i * 3 + 0] * 3 + 2],
    );

    const v2 = new Vec3(
      position[index[i * 3 + 1] * 3 + 0] - v1.x,
      position[index[i * 3 + 1] * 3 + 1] - v1.y,
      position[index[i * 3 + 1] * 3 + 2] - v1.z,
    );

    const v3 = new Vec3(
      position[index[i * 3 + 2] * 3 + 0] - v1.x,
      position[index[i * 3 + 2] * 3 + 1] - v1.y,
      position[index[i * 3 + 2] * 3 + 2] - v1.z,
    );

    let normal = new Vec3().cross(v2, v3).normalize();

    if (normal[0] === 0 && normal[1] === 0 && normal[3] === 0) {
      normal = lastNormal;
    }

    for (let j = 0; j < 3; j++) {
      normals[index[i * 3 + j] * 3 + 0] = normal.x;
      normals[index[i * 3 + j] * 3 + 1] = normal.y;
      normals[index[i * 3 + j] * 3 + 2] = normal.z;
    }

    lastNormal = normal;
  }

  return geometry;
}
