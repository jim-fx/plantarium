import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Output',
  type: 'output',
  outputs: [],
  meta: {
    description: `Every nodesystem needs one output node to create the final output`
  },
  parameters: {
    input: {
      type: 'plant',
      required: true,
      label: 'plant',
      external: true,
    },
  }
});

