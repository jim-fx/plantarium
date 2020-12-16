import NodeParser from './NodeParser';
import NodeSystemView from '../view/NodeSystemView';
import NodeFactory from './NodeFactory';
import type Node from './Node';
import NodeTypeStore from './NodeTypeStore';

import DefaultNodes from '../nodes';
import type NodeType from './NodeType';
import { EventEmitter } from '@plantarium/helpers';
import Logger from './Logger';

/**
 * @ignore
 */
let systemID = 0;

interface NodeSystemOptions {
  view?: boolean;
  wrapper?: HTMLElement;
  defaultNodes?: string[] | boolean;
  registerNodes?: NodeTypeData[];
  logLevel?: number;
  parent?: HTMLElement;
}

export default class NodeSystem extends EventEmitter {
  private parser: NodeParser = new NodeParser(this);
  meta: NodeSystemMeta = { lastSaved: Date.now() };

  outputNode!: Node;
  factory: NodeFactory;
  store: NodeTypeStore;

  log: Logger;

  nodes: Node[] = [];
  _result: unknown;

  states: NodeSystemData[] = [];

  id: number = systemID++;

  view!: NodeSystemView;
  options: NodeSystemOptions;

  constructor(options: NodeSystemOptions = {}) {
    super();
    const {
      view = false,
      wrapper = document.body,
      defaultNodes = false,
      registerNodes = false,
      logLevel = 2,
    } = options;
    this.options = { view, wrapper };

    this.log = new Logger(this, logLevel);
    this.log.group(`Instantiated id:${this.id}`);
    this.store = new NodeTypeStore();
    this.factory = new NodeFactory(this);

    if (view) {
      this.view = new NodeSystemView(this);
      this.view.on(
        'transform',
        (transform) => {
          this.meta = Object.assign({}, this.meta, { transform });
          this.save();
        },
        100,
      );
    }

    if (defaultNodes) {
      const nodesToRegister: (NodeType | NodeTypeData)[] = [];

      if (defaultNodes === true) {
        nodesToRegister.push(
          ...Object.entries(DefaultNodes).map((entry) => entry[1]),
        );
      } else if (Array.isArray(defaultNodes) && defaultNodes.length) {
        defaultNodes.forEach((type) => {
          if (typeof type === 'string' && type in DefaultNodes) {
            nodesToRegister.push(DefaultNodes[type]);
          }
        });
      }

      nodesToRegister.forEach((nodeType) => this.registerNodeType(nodeType));
    }

    if (registerNodes && registerNodes.length) {
      registerNodes.forEach(this.registerNodeType.bind(this));
    }

    this.log.groupEnd();
  }

  get result() {
    return this._result;
  }

  set result(res) {
    this.emit('result', res);
    this._result = res;
  }

  load(systemData: NodeSystemData) {
    this.nodes.forEach((n) => (n.enableUpdates = false));
    this.nodes.forEach((n) => n.remove());
    this.factory.reset();
    const nodes = this.parser.parseSystem(systemData);
    this.addNodes(nodes);
    this.meta = systemData.meta || { lastSaved: 0 };
    this.meta.lastSaved = Date.now();
    if (this.view) this.view.setTransform(this.meta.transform);

    this.log.info(
      `Loaded NodeSystemData with ${nodes.length} Nodes`,
      systemData,
    );

    return this;
  }

  serialize() {
    return {
      ...this.parser.getData(),
      meta: this.meta,
    };
  }

  save() {
    this.meta.lastSaved = Date.now();
    this.log.info('save system', this.serialize());
    this.emit('save', this.serialize());
  }

  addNodes(nodes: Node[]) {
    nodes.forEach((n) => this.addNode(n));
  }

  addNode(node: Node) {
    this.nodes.push(node);
    node.on('attributes', () => this.save(), 500);
    node.on('data', () => this.save(), 500);
    this.save();
  }

  removeNode(node: Node) {
    node.view.remove();

    Object.values(node.states).forEach((i) => i.remove());
    node.outputs.forEach((o) => o.remove());

    this.nodes = this.nodes.filter((n) => n !== node);

    this.save();

    this.log.info(
      `Removed Node id:${node.id} type:${node.attributes.type}`,
      node.deserialize(),
    );
  }

  getSockets(type?: string) {
    const sockets = this.nodes.map((n) => [...n.getSockets()]).flat();
    if (!type) return sockets;
    return sockets.filter((s) => s.type === type);
  }

  getInputs(type?: string) {
    const inputs = this.nodes.map((n) => n.getInputs()).flat();
    if (!type || type === '*') return inputs;
    return inputs.filter((s) => s.type.includes('*') || s.type.includes(type));
  }

  getOutputs(type?: string[]) {
    const outputs = this.nodes.map((n) => n.outputs).flat();
    if (!type || type.includes('*')) return outputs;
    return outputs.filter((s) => s.type === '*' || type.includes(s.type));
  }

  createNode(props: NodeProps) {
    const node = this.factory.create(props);
    this.addNode(node);
    this.save();
    this.log.info(
      `Created new node id:${props.attributes.id} type:${props.attributes.type}`,
      props,
    );
    return node;
  }

  getNodes() {
    return this.nodes;
  }

  getNodeTypes(): NodeType[] {
    return this.store.types;
  }

  registerNodeType(type: NodeType | NodeTypeData) {
    if ('node' in type) {
      this.store.add(type);
    } else {
      const _type = this.parser.parseType(type);
      this.store.add(_type);
    }

    this.log.info(`Registered new nodeType type:${type.title}`, type);
  }
}
