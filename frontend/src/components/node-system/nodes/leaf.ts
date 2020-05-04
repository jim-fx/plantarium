export default {
  name: 'Leaf',
  outputs: ['leaf'],
  inputs: ['number'],
  state: {
    id: 'value',
    type: 'number',
    value: 0,
  },
  compute(inputData: any[], state: any) {
    return {
      type: 'leaf',
      stuff: 'settings',
      values: inputData[0] ?? state.value,
    };
  },
};
