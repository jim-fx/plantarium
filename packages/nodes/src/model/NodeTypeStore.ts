import { EventEmitter } from '@plantarium/helpers';
import NodeType from './NodeType';

export default class NodeTypeStore extends EventEmitter {
  types: NodeType[] = [];
  typeMap: { [name: string]: NodeType } = {};

  constructor() {
    super();
  }

  add(type: NodeType) {
    if (!type.inputs && !type.outputs) {
      // @ts-ignore
      const temp = new type.node({}, { attributes: { id: 'TempNode' } });
      type.inputs = temp.inputs.map((o) => o.type[0]);
      type.outputs = temp.outputs.map((o) => o.type);
    }

    this.types = [
      ...this.types.filter(
        (t) => t.name.toLowerCase() !== type.name.toLowerCase(),
      ),
      type,
    ];
    this.typeMap[type.name.toLowerCase()] = type;
    this.emit('types', this.types);
    this.emit('type', type);
  }

  getByName(name: string) {
    if (name in this.typeMap) return this.typeMap[name];

    throw new Error('NodeTypeStore: type ' + name + ' does not exist');
  }
}
