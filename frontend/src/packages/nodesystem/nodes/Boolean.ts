export default {
  title: 'Boolean',
  type: 'boolean',
  outputs: ['boolean'],
  parameters: {
    value: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  compute({ value = false }) {
    return value;
  },
};
