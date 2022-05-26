import { length3D } from "../helpers";

export function applyForceToSkeleton(skeleton: Float32Array, origin: { x: number, y: number, z: number }, strength: number, distance: number) {

  const amountPoints = skeleton.length / 4;

  for (let i = 0; i < amountPoints; i++) {

    const x = skeleton[i * 4 + 0];
    const y = skeleton[i * 4 + 1];
    const z = skeleton[i * 4 + 2];

    const vec = [x - origin.x, y - origin.y, z - origin.z];

    const dist = length3D(vec[0], vec[1], vec[2]);

    const alpha = i / amountPoints;

    if (dist < distance) {
      const d = (distance - dist) / distance

      const stre = d * d * d * strength * alpha;

      skeleton[i * 4 + 0] = x + vec[0] * stre;
      skeleton[i * 4 + 1] = y + vec[1] * stre;
      skeleton[i * 4 + 2] = z + vec[2] * stre;
    }


  }

  return skeleton;

}
