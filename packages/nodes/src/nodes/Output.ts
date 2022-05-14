import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Output',
  type: 'output',
  outputs: [],
  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
  }
});

