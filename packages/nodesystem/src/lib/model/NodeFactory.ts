import { genId, logger } from '@plantarium/helpers';

import type { NodeProps } from '../types';
import type Node from './Node';
import type NodeSystem from './NodeSystem';

const log = logger('NodeFactory');

export default class NodeFactory {
  system: NodeSystem;

  id = genId();

  constructor(system: NodeSystem) {
    this.system = system;
    log(`Initialized`);
  }

  reset() {
    this.id.reset();
    log('Reset id generator');
  }

  create(props: NodeProps): Node {
    const { attributes } = props;

    attributes.type = attributes.type.toLowerCase();

    const type = this.system.store.getByType(attributes.type);

    attributes.id = this.id(+attributes.id);

    const node = new type.node(this.system, props);

    if (this.system.options.view && type.view) {
      const view = new type.view(node);
      node.bindView(view);
    }

    if (type.type === 'output') {
      this.system.setOutputNode(node);
    }

    log(`Created node with type ${attributes.type}`, props);

    return node;
  }
}
