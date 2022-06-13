import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Vec3Length',
  type: 'vec3length',
  outputs: ['number'],
  parameters: {
    vec: {
      type: 'vec3',
      label: false,
      value: { x: 0, y: 0, z: 0 },
    },
  },
  compute(parameters) {
    const vec = parameters.vec();

    if (vec) {
      return Math.sqrt(
        Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2),
      );
    }
    return 0;
  },
});

