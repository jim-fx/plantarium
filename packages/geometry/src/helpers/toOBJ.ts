import { TransferGeometry } from "@plantarium/types";
import sanityCheckGeometry from "./sanityCheckGeometry";

export default function(_geo: TransferGeometry[] | TransferGeometry) {


  const geometries = Array.isArray(_geo) ? _geo : [_geo];
  console.log("TOOBJ", geometries)

  let output = '';

  let indexVertex = 0;
  let indexVertexUvs = 0;
  let indexNormals = 0;

  const face = [];

  function parseMesh(geometry: TransferGeometry) {

    let nbVertex = 0;
    let nbNormals = 0;
    let nbVertexUvs = 0;

    // shortcuts
    const { index, uv, normal, position } = geometry;

    // name of the mesh object
    output += 'o ' + "plant" + '\n';

    // name of the mesh material
    // if (mesh.material && mesh.material.name) {
    //   output += 'usemtl ' + mesh.material.name + '\n';
    // }

    // vertices

    if (position?.length) {
      for (let i = 0; i < position.length; i += 3) {
        const [x, y, z] = position.slice(i, i + 3);
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
          continue;
        }
        output += 'v ' + x + ' ' + y + ' ' + z + '\n';
      }
    }

    // uvs
    if (uv?.length) {
      for (let i = 0; i < uv.length; i += 2) {
        const [x, y] = uv.slice(i, i + 2)
        // transform the uv to export format
        output += 'vt ' + x + ' ' + y + '\n';
      }
    }

    // normals
    if (normal?.length) {
      for (let i = 0; i < normal.length; i += 3) {
        const [x, y, z] = normal.slice(i, i + 3);
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
          continue;
        }
        output += 'vn ' + x + ' ' + y + ' ' + z + '\n';
      }
    }

    // faces
    if (index?.length) {
      for (let i = 0; i < index.length; i += 3) {
        for (let m = 0; m < 3; m++) {
          const j = index[i + m] + 1;
          face[m] = (indexVertex + j) + (normal || uv ? '/' + (uv ? (indexVertexUvs + j) : '') + (normal ? '/' + (indexNormals + j) : '') : '');
        }

        // transform the face to export format
        output += 'f ' + face.join(' ') + '\n';

      }

    } else {

      for (let i = 0, l = position.length; i < l; i += 3) {

        for (let m = 0; m < 3; m++) {
          const j = i + m + 1;
          face[m] = (indexVertex + j) + (normal || uv ? '/' + (uv ? (indexVertexUvs + j) : '') + (normal ? '/' + (indexNormals + j) : '') : '');
        }

        // transform the face to export format
        output += 'f ' + face.join(' ') + '\n';

      }

    }

    // update index
    indexVertex += nbVertex;
    indexVertexUvs += nbVertexUvs;
    indexNormals += nbNormals;

  }

  geometries.forEach(geo => parseMesh(geo));


  return output;

}
