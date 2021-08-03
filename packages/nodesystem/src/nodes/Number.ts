export default {
  title: 'Number',
  type: 'number',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      internal: true,
      label: false,
      defaultValue: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
};
