import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Output',
  type: 'output',
  outputs: [],
  parameters: {
    input: {
      type: 'plant',
      required: true,
      label: 'plant',
      external: true,
    },
  }
});

