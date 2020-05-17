export default {
  name: 'Boolean',
  outputs: ['boolean'],
  state: {
    value: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  compute({ value = false }) {
    return value;
  },
};
