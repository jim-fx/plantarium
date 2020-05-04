export default {
  name: 'Color',
  outputs: ['vec3'],
  state: [
    {
      id: 'r',
      defaultValue: 0,
      type: 'number',
      min: 0,
      max: 1,
      steps: 0.05,
    },
    {
      id: 'g',
      defaultValue: 0,
      type: 'number',
      min: 0,
      max: 1,
      steps: 0.05,
    },
    {
      id: 'b',
      defaultValue: 0,
      type: 'number',
      min: 0,
      max: 1,
      steps: 0.05,
    },
  ],
  compute(inputData: number[], { r = 0, g = 0, b = 0 }) {
    return [r, g, b];
  },
};
