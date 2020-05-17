export default {
  name: 'Leaf',
  outputs: ['leaf'],
  state: {
    value: {
      type: 'number',
      value: 0,
    },
  },
  compute({ value = 0 }) {
    return {
      type: 'leaf',
      stuff: 'settings',
      values: value,
    };
  },
};
