import type NodeOutput from '../model/NodeOutput';
import type NodeInput from '../model/NodeInput';

export default (output: NodeOutput, input: NodeInput) => {
  return input.type.includes(output.type) || input.type.includes('*');
};
