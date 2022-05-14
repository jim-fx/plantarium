import { typeCheckNode } from "../types";

export default typeCheckNode({
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
  computeValue({ value = 0 }) {
    return value as number;
  },
});
