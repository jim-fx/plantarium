import { typeCheckNode } from '../types';

export default typeCheckNode({
  title: 'Alpha',
  type: 'alpha',
  outputs: ['number'],
  parameters: {
    min: {
      type: 'number',
      inputType: "float",
      internal: true,
      value: 0,
    },
    max: {
      type: 'number',
      inputType: "float",
      internal: true,
      value: 1,
    }
  },
  compute({ min, max }, _, alpha) {
    return min + (max - min) * alpha;
  },
});

