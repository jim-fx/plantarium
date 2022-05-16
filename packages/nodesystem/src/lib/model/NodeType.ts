import type NodeView from '../view/NodeView';
import type Node from './Node';

export default interface NodeType {
  title: string;
  meta?: {
    description?: string;
    tags?: string[];
  };
  type?: string;
  inputs?: (string[] | string)[];
  outputs?: string[];
  node: typeof Node;
  view?: typeof NodeView;
}
