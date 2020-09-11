import { EventEmitter } from '@plantarium/helpers';
import NodeType from './NodeType';

export default class NodeTypeStore extends EventEmitter {
  types: NodeType[] = [];
  typeMap: { [name: string]: NodeType } = {};

  constructor() {
    super();
  }

  add(type: NodeType) {
    console.trace('ADD TYPE', type);

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
