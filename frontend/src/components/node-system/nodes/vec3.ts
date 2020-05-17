export default {
  name: 'Vec3',
  inputs: ['number', 'number', 'number'],
  outputs: ['vec3'],
  state: {
    x: {
      type: 'number',
      label: false,
      value: 0,
    },
    y: {
      type: 'number',
      label: false,
      value: 0,
    },
    z: {
      type: 'number',
      label: false,
      value: 0,
    },
  },
  compute({ x = 0, y = 0, z = 0 }) {
    return { x, y, z };
  },
};
