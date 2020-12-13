export default {
  title: 'Number',
  type: 'number',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      external: false,
      defaultValue: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
};
