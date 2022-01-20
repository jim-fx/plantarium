const node: PlantNode = {
  title: 'Vec3Length',
  type: 'vec3length',
  outputs: ['number'],
  parameters: {
    vec: {
      label: false,
      type: 'vec3',
      value: 0,
      defaultValue: 0,
    },
  },
  computeValue(parameters, ctx) {
    const { vec } = parameters;

    if (vec) {
      return Math.sqrt(
        Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2),
      );
    }
    return 0;
  },
};

export default node;
