import { EventEmitter, logger } from '@plantarium/helpers';
import type NodeType from './NodeType';

const log = logger('NodeTypeStore');

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
        (t) => t.type.toLowerCase() !== type.type.toLowerCase(),
      ),
      type,
    ];

    this.typeMap[type.type.toLowerCase()] = type;
    this.emit('types', this.types);
    this.emit('type', type);
  }

  clear() {
    this.typeMap = {};
    this.types = [];
    this.emit('types', this.types);
  }

  getByType(type: string) {
    if (type in this.typeMap) return this.typeMap[type];
    if (type.toLowerCase() in this.typeMap)
      return this.typeMap[type.toLowerCase()];
    throw new Error('NodeTypeStore: type ' + type + ' does not exist');
  }
}
