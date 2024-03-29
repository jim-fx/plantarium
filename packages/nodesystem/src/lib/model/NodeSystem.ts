import { debounceDecorator, EventEmitter, logger } from '@plantarium/helpers';
import DefaultNodes from '../nodes';
import type {
  NodeProps,
  NodeSystemData,
  NodeSystemMeta,
  NodeTypeData,
} from '../types';
import NodeSystemView from '../view/NodeSystemView';
import type Node from './Node';
import NodeFactory from './NodeFactory';
import NodeHistory from './NodeHistory';
import NodeParser from './NodeParser';
import type NodeType from './NodeType';
import NodeTypeStore from './NodeTypeStore';

/**
 * @ignore
 */
let systemID = 0;

interface NodeSystemOptions {
  view: boolean;
  wrapper: HTMLElement | null;
  defaultNodes: string[] | boolean;
  hideLegend: boolean;
  connectionColors: Record<string, string>;
  enableDrawing: boolean;
  registerNodes: NodeTypeData[];
  deferCompute: boolean;
  logLevel: number;
  parent: HTMLElement;
  showUpdates: boolean;
}

const log = logger('NodeSystem');

export default class NodeSystem extends EventEmitter {
  private parser: NodeParser = new NodeParser(this);
  meta: NodeSystemMeta = { lastSaved: Date.now() };

  outputNode!: Node;
  factory: NodeFactory;
  store: NodeTypeStore;
  history: NodeHistory;

  isLoaded = false;
  isPaused = false;

  nodes: Node[] = [];
  _result: unknown;

  states: NodeSystemData[] = [];

  id: number | string = systemID++;

  view!: NodeSystemView;
  options: Partial<NodeSystemOptions>;

  constructor(options: Partial<NodeSystemOptions> = {}) {
    super();
    const {
      view = false,
      wrapper,
      defaultNodes = false,
      registerNodes = false,
      connectionColors = false,
      showUpdates = false,
      enableDrawing = false,
      deferCompute = false,
    } = options;
    this.options = { view, wrapper, showUpdates, deferCompute, enableDrawing };

    try {
      log(`Instantiated id:${this.id}`);
      this.store = new NodeTypeStore();
      this.factory = new NodeFactory(this);
      this.history = new NodeHistory(this);

      if (view) {
        this.view = new NodeSystemView(this);

        if (connectionColors) {
          this.view.colorStore.setColors(connectionColors);
        }
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
        registerNodes.forEach((n) => this.registerNodeType(n));
      }
    } catch (error) {
      log.warn('Error Loading', error);
      this.emit('error', { type: 'init', error });
    }
  }

  get result() {
    return this._result;
  }

  set result(res) {
    this._result = res;
    if (this.isLoaded) this.emit('result', res);
  }

  setMetaData(data: Partial<NodeSystemMeta>) {
    this.meta = { ...this.meta, ...data };
    this.save();
  }

  load(systemData: NodeSystemData) {
    log('Loading NodeSystemData', { systemData });
    if (!systemData) {
      this.isLoaded = true;
      this?.view?.setState('loading');
      return;
    }
    try {
      this.emit('loading');
      this?.view.setState('loading');
      if (systemData.id) {
        this.id = systemData.id;
      }
      this.isLoaded = false;
      this.isPaused = true;
      this.nodes.forEach((n) => (n.enableUpdates = false));
      this.nodes.forEach((n) => n.remove());
      this.factory.reset();
      const nodes = this.parser.parseSystem(systemData);
      this.addNodes(nodes);
      this.meta = systemData.meta;
      this?.view?.setTransform(this.meta.transform);

      log(`Loaded NodeSystemData with ${nodes.length} Nodes`, systemData);

      if ('history' in systemData) {
        this.history.deserialize(systemData.history);
      } else {
        this.history.clear();
      }

      this.isPaused = false;
      this.isLoaded = true;

      this.result = this._result;

      this.emit('loaded');
      if (this.view) {
        setTimeout(() => this.view.setState(), 150);
      }
      return this;
    } catch (error) {
      log.warn('Error', error);
      this.emit('loaded');
      this.emit('error', { type: 'loading', error });
    }
  }

  applyNodeState(newNodes: NodeSystemData['nodes']) {
    this.isPaused = true;

    let hasDeletedNodes = false;
    let hasNewNodes = false;

    const currentNodes = this.getNodes();

    for (const n of newNodes) {
      if (!currentNodes.find((_n) => _n.attributes.id === n.attributes.id)) {
        hasNewNodes = true;
        break;
      }
    }

    for (const n of currentNodes) {
      if (!newNodes.find((_n) => _n.attributes.id === n.id)) {
        hasDeletedNodes = true;
        break;
      }
    }

    if (hasNewNodes) {
      const s = this.serialize();
      s.nodes = newNodes;
      return this.load(s);
    }

    if (hasDeletedNodes) {
      currentNodes
        .filter((node) => !newNodes.find((n) => n.attributes.id === node.id))
        .forEach((n) => n.remove());
    }

    newNodes.forEach((n) => {
      const cn = currentNodes.find((_n) => _n.id === n.attributes.id);
      cn.setAttributes(n.attributes);
      Object.entries(n.state).forEach(([key, value]) => {
        cn.setStateValue(key, value);
      });
    });

    this.isPaused = false;
  }

  serialize(): NodeSystemData {
    return {
      id: this.id.toString(),
      ...this.parser.getData(),
      history: this.history.serialize(),
      meta: this.meta,
    };
  }

  @debounceDecorator(1000)
  save() {
    if (this.isLoaded) {
      this.meta.lastSaved = Date.now();
      log('save system', this.serialize());
      this.emit('save', this.serialize());
    }
  }

  setOutputNode(node: Node) {
    if (this.outputNode) {
      this.outputNode.remove();
    }
    this.outputNode = node;
    node.on('computedData', (data) => {
      if (this.options.deferCompute) {
        this.result = {
          type: 'output',
          parameters: data,
        };
      } else {
        this.result = data;
      }
    });
  }

  addNodes(nodes: Node[]) {
    nodes.forEach((n) => this.addNode(n));
  }

  addNode(node: Node) {
    this.history.addAction();
    this.nodes.push(node);
    this.save();
  }

  removeNode(node: Node) {
    this.history.addAction();

    node.enableUpdates = false;

    node.view.remove();

    Object.values(node.states).forEach((i) => i.remove());

    node.outputs.forEach((o) => o.remove());
    node.getInputs().forEach((i) => i.remove());

    this.nodes = this.nodes.filter((n) => n !== node);

    this.save();

    log(
      `Removed Node id:${node.id} type:${node.attributes.type}`,
      node.deserialize(),
    );
  }

  spliceNode(node: Node) {
    const leftSockets = node.getInputs().map((i) => i?.connection?.input);
    const rightSockets = node.outputs
      .map((o) => o.connections)
      .flat()
      .map((c) => c.output);

    for (let i = 0; i < leftSockets.length; i++) {
      const leftSocket = leftSockets[i];
      const rightSocket = rightSockets[i];
      if (!rightSocket || !leftSocket) continue;
      leftSocket.connectTo(rightSocket);
    }

    return this.removeNode(node);
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
    log(
      `Created new node id:${props.attributes.id} type:${props.attributes.type}`,
      props,
    );
    return node;
  }

  getNodes() {
    return this.nodes;
  }

  findNodeById(id: string) {
    return this.nodes.filter((node) => node.id === id)[0];
  }

  getNodeTypes(): NodeType[] {
    return this.store.types;
  }

  registerNodeType(
    type: NodeType | NodeTypeData | NodeType[] | NodeTypeData[],
  ) {
    if (Array.isArray(type)) {
      return type.forEach((t: NodeType | NodeTypeData) =>
        this.registerNodeType(t),
      );
    }
    if ('node' in type) {
      this.store.add(type);
    } else {
      const _type = this.parser.parseType(type);
      this.store.add(_type);
    }
  }
}
