import { genId } from '@plantarium/helpers';

import type NodeSystem from './NodeSystem';
import type Node from './Node';
import Logger from './Logger';

export default class NodeFactory {
  system: NodeSystem;

  log: Logger;

  id = genId();

  constructor(system: NodeSystem) {
    this.system = system;
    this.log = new Logger(this);
    this.log.info(`Initialized`);
  }

  reset() {
    this.id.reset();
    this.log.info('Reset id generator');
  }

  create(props: NodeProps): Node {
    const { attributes } = props;

    const name = attributes.type.toLowerCase();

    const type = this.system.store.getByName(name);

    attributes.id = this.id(+attributes.id);

    const node = new type.node(this.system, props);

    if (this.system.options.view && type.view) {
      const view = new type.view(node);
      node.bindView(view);
    }

    if (name === 'output') {
      this.system.setOutputNode(node);
    }

    this.log.info(`Created node with type ${attributes.type}`, props);

    return node;
  }
}
