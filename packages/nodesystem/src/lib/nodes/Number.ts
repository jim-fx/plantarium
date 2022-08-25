import { checkNodeType } from '../types';

export default checkNodeType({
  title: 'Number',
  type: 'number',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      internal: true,
      label: false,
      value: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
});
