export default {
  name: 'Number',
  outputs: ['number'],
  state: {
    value: {
      type: 'number',
      defaultValue: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
};
