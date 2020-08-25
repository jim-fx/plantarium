export default {
  name: 'Parameter',
  outputs: ['number'],
  state: {
    value: {
      type: 'number',
      value: 0,
    },
    variation: {
      type: 'number',
      value: 0,
    },
  },
  compute({ value = 0, variation = 0 }) {
    return {
      value,
      variation,
    };
  },
};
