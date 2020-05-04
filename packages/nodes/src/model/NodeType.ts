import NodeView from 'view/NodeView';
import Node from './Node';

export default interface NodeType {
  name: string;
  meta?: {
    description?: string;
    tags?: string[];
  };
  inputs?: (string[] | string)[];
  outputs?: string[];
  node: typeof Node;
  view?: typeof NodeView;
}
