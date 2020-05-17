import NodeView from 'view/NodeView';
import NodeOutput from './NodeOutput';
import NodeInput from './NodeInput';
import NodeConnection from './NodeConnection';
import { memoize, inputChanged, EventEmitter } from '@plantarium/helpers';
import NodeSystem from './NodeSystem';
import NodeState from './NodeState';

export default class Node extends EventEmitter {
  system: NodeSystem;

  id: string;
  attributes: NodeAttributes;

  inputs: { [key: string]: NodeInput } = {};
  outputs: NodeOutput[] = [];

  state = {};
  states: NodeState[] = [];

  computedData: unknown;

  view!: NodeView;

  wrapper!: HTMLDivElement;

  enableUpdates = true;
  update: (inputData?: unknown[]) => void;
  _compute: (state: unknown) => unknown;

  _unsubscribeNodeMove: (() => void) | undefined;

  refs: { node: Node; keyIn: string[] }[] = [];

  constructor(system: NodeSystem, props: NodeProps) {
    super();

    this.system = system;

    const { attributes, state } = props;
    this.attributes = attributes;
    this.id = attributes.id;
    this.state = state || {};

    this._compute = memoize((_state = this.state) => {
      if (Object.keys(_state).length > 0) {
        return this.compute(_state);
      }
      return;
    });

    this.update = inputChanged(
      (_state = this.state) => this.enableUpdates && this._update(_state),
    );
  }

  bindView(view: NodeView) {
    this.view = view;

    this.outputs.forEach((o) => o.bindView());
    this.states.forEach((s) => s.bindView());

    this._unsubscribeNodeMove = this.view.on('move', ({ x, y }) => {
      this.attributes.pos = { x, y };
      this.emit('attributes', this.attributes);
    });
  }

  setState(state: unknown) {
    this.state = Object.assign({}, this.state, state);

    this.emit('state', this.state);

    this.update();

    this.save();
  }

  setStateValue(key: string, data: unknown) {
    this.setState(Object.assign({}, this.state, { [key]: data }));
  }

  getState() {
    return this.state;
  }

  compute(state: unknown): unknown {
    return Object.assign({}, state);
  }

  getChildren() {
    return this.outputs
      .map((o) => o.connections)
      .flat()
      .map((c) => c.input.node);
  }

  getSockets(): (NodeOutput | NodeInput)[] {
    const sockets: (NodeOutput | NodeInput)[] = [];

    sockets.push(...this.states.map((s) => s.getInput()));

    sockets.push(...this.outputs);

    return sockets;
  }

  _update(state: unknown) {
    this.computedData = this._compute(state);

    this.emit('computedData', this.computedData);

    this.refs.forEach((ref) => {
      ref.keyIn.forEach((keyIn) => {
        ref.node.state[keyIn] = this.computedData;
      });
      ref.node.update();
    });
  }

  remove() {
    if (this._unsubscribeNodeMove) this._unsubscribeNodeMove();
    this.system.removeNode(this);
  }

  connectTo(
    node: Node,
    keyIn: string = Object.keys(node.inputs)[0],
  ): NodeConnection {
    const output = this.outputs[0];
    const input = node.inputs[keyIn];

    const connection = new NodeConnection(this.system, { output, input });

    // Check if node already has a connection to this node
    const existingRef = this.refs.find((ref) => ref.node.id === node.id);

    if (existingRef) {
      existingRef.keyIn.push(keyIn);
    } else {
      this.refs.push({ node, keyIn: [keyIn] });
    }

    this.update();

    return connection;
  }

  disconnectFrom(node: Node, keyIn: string) {
    this.refs = this.refs.filter((ref) => {
      ref.keyIn.splice(ref.keyIn.indexOf(keyIn), 1);
      if (ref.keyIn.length === 0) return false;
      return !(ref.node.id === node.id && ref.keyIn[0] === keyIn);
    });
    this.update();
  }

  deserialize() {
    const attributes = Object.assign({}, this.attributes);

    attributes.refs = this.outputs
      .map((o) => o.connections)
      .flat()
      .map((c) => c.deserialize());

    return Object.assign(
      {},
      {
        attributes,
        state: this.state,
      },
    );
  }

  save() {
    this.system.save();
  }
}
