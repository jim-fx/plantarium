export default {
  name: 'Number',
  outputs: ['number'],
  state: {
    id: 'value',
    type: 'number',
    defaultValue: 0,
  },
  compute(_inputData: any[], state) {
    return state.value;
  },
};
