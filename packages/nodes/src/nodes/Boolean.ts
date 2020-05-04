export default {
  name: 'Boolean',
  outputs: ['boolean'],
  state: {
    id: 'value',
    type: 'boolean',
    defaultValue: false,
  },
  compute(inputData, { value = false }) {
    return value;
  },
};
