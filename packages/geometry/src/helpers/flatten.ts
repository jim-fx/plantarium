export default function (mesh: TransferGeometry): TransferGeometry {
  const amountVertices = mesh.position.length / 3;

  const newPosition = new Float32Array(amountVertices * 2);

  for (let i = 0; i < amountVertices; i++) {
    newPosition[i * 2 + 0] = mesh.position[i * 3 + 0];
    newPosition[i * 2 + 1] = mesh.position[i * 3 + 2];
  }

  return { ...mesh, position: newPosition };
}
