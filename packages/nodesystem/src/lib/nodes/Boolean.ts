import { checkNodeType } from "../types"

export default checkNodeType({
  title: 'Boolean',
  type: 'boolean',
  outputs: ['boolean'],
  meta: {
    description: `This is the boolean node`,
  },
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
