export default function (model: TransferGeometry): string {
  let output = '';

  let indexVertex = 0;
  let indexVertexUvs = 0;
  let indexNormals = 0;

  let i, j, l, m;

  const face: string[] = [];

  const parseMesh = function (mesh: TransferGeometry) {
    let nbVertex = 0;
    let nbNormals = 0;
    let nbVertexUvs = 0;

    // shortcuts
    const vertices = mesh.position;
    const normals = mesh.normal;
    const uvs = mesh.uv;
    const indices = mesh.index;

    // name of the mesh object
    output += 'o ' + 'defualt' + '\n';

    // vertices

    if (vertices !== undefined) {
      for (i = 0, l = vertices.length; i < l; i += 3, nbVertex += 3) {
        // transform the vertex to export format
        output +=
          'v ' +
          vertices[i + 0] +
          ' ' +
          vertices[i + 1] +
          ' ' +
          vertices[i + 2] +
          '\n';
      }
    }

    // uvs

    if (uvs !== undefined) {
      for (i = 0, l = uvs.length; i < l; i += 2, nbVertexUvs += 2) {
        // transform the uv to export format
        output += 'vt ' + uvs[i + 0] * -1 + ' ' + uvs[i + 1] + '\n';
      }
    }

    // normals

    if (normals !== undefined) {
      for (i = 0, l = normals.length; i < l; i += 3, nbNormals += 3) {
        // transform the normal to export format
        output +=
          'vn ' +
          normals[i + 0] +
          ' ' +
          normals[i + 1] +
          ' ' +
          normals[i + 2] +
          '\n';
      }
    }

    // faces

    if (indices !== null) {
      for (i = 0, l = indices.length; i < l; i += 3) {
        for (m = 0; m < 3; m++) {
          j = indices[i + m] + 1;

          face[m] =
            indexVertex +
            j +
            '/' +
            (uvs ? indexVertexUvs + j : '') +
            '/' +
            (indexNormals + j);
        }

        // transform the face to export format
        output += 'f ' + face.join(' ') + '\n';
      }
    } else {
      for (i = 0, l = vertices.length; i < l; i += 3) {
        for (m = 0; m < 3; m++) {
          j = i + m + 1;

          face[m] =
            indexVertex +
            j +
            '/' +
            (uvs ? indexVertexUvs + j : '') +
            '/' +
            (indexNormals + j);
        }

        // transform the face to export format
        output += 'f ' + face.join(' ') + '\n';
      }
    }

    // update index
    indexVertex += nbVertex;
    indexVertexUvs += nbVertexUvs;
    indexNormals += nbNormals;
  };

  parseMesh(model);

  return output;
}
