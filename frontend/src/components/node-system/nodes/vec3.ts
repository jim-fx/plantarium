export default {
  name: 'Vec3',
  inputs: ['number', 'number', 'number'],
  outputs: ['vec3'],
  state: [
    {
      id: 'x',
      type: 'number',
      defaultValue: 0,
    },
    {
      id: 'y',
      type: 'number',
      defaultValue: 0,
    },
    {
      id: 'z',
      type: 'number',
      defaultValue: 0,
    },
  ],
  compute(inputData: number[], { x = 0, y = 0, z = 0 }) {
    return [x, y, z].map((v, i) => inputData[i] ?? (v || 0));
  },
};
