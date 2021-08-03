import { EventEmitter, logger } from '@plantarium/helpers';
import type NodeType from './NodeType';

const log = logger('nodes.typestore');

export default class NodeTypeStore extends EventEmitter {
  types: NodeType[] = [];
  typeMap: { [name: string]: NodeType } = {};

  constructor() {
    super();
  }

  add(type: NodeType) {
    log('register new type ' + type.title, type);

    this.types = [
      ...this.types.filter(
        (t) => t.title.toLowerCase() !== type.title.toLowerCase(),
      ),
      type,
    ];

    this.typeMap[type.title.toLowerCase()] = type;
    this.emit('types', this.types);
    this.emit('type', type);
  }

  getByName(name: string) {
    if (name in this.typeMap) return this.typeMap[name];

    throw new Error('NodeTypeStore: type ' + name + ' does not exist');
  }
}
