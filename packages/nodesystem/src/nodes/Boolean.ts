import { checkNodeType } from "../@types"

export default checkNodeType({
  title: 'Boolean',
  type: 'boolean',
  outputs: ['boolean'],
  parameters: {
    value: {
      type: 'boolean',
      value: false,
    },
  },
  compute({ value = false }) {
    return value;
  },
});
