import NodeView from 'view/NodeView';
import NodeOutput from './NodeOutput';
import NodeInput from './NodeInput';
import NodeConnection from './NodeConnection';
import { memoize, inputChanged, EventEmitter } from '@plantarium/helpers';
import NodeSystem from './NodeSystem';

export default class Node extends EventEmitter {
  system: NodeSystem;

  id: string;
  attributes: NodeAttributes;

  inputs: NodeInput[] = [];
  outputs: NodeOutput[] = [];

  state = {};

  inputData: unknown[] = [];
  computedData: unknown;

  view!: NodeView;

  wrapper!: HTMLDivElement;

  enableUpdates = true;
  update: (inputData?: unknown[]) => void;
  _compute: (inputData: unknown[], state: unknown) => unknown;

  _unsubscribeNodeMove: (() => void) | undefined;

  refs: { node: Node; indexIn: number | number[]; indexOut: number }[] = [];

  constructor(system: NodeSystem, props: NodeProps) {
    super();

    this.system = system;

    const { attributes, state } = props;
    this.attributes = attributes;
    this.id = attributes.id;
    this.state = state || {};

    this._compute = memoize(
      (inputData: unknown[] = this.inputData, _state = this.state) => {
        if (inputData.length || Object.keys(_state).length > 0) {
          return this.compute(inputData, _state);
        }
        return;
      },
    );

    this.update = inputChanged(
      (inputData: unknown[] = this.inputData, _state = this.state) =>
        this.enableUpdates && this._update(inputData, _state),
    );
  }

  bindView(view: NodeView) {
    this.view = view;

    this.outputs.forEach((o) => o.bindView());
    this.inputs.forEach((i) => i.bindView());

    this._unsubscribeNodeMove = this.view.on('move', ({ x, y }) => {
      this.attributes.pos = { x, y };
      this.emit('attributes', this.attributes);
    });
  }

  getState() {
    return this.state;
  }

  setState(state: unknown) {
    this.state = Object.assign({}, this.state, state);

    this.emit('state', this.state);

    this.update();

    this.save();
  }

  compute(_inputData: unknown[], state: unknown): unknown {
    return Object.assign({}, state);
  }

  getChildren() {
    const outConnections = this.outputs.map((o) => o.connections).flat();

    const childNodes = outConnections.map((c) => c.input.node);

    return childNodes;
  }

  getSockets(): (NodeOutput | NodeInput)[] {
    const sockets: (NodeOutput | NodeInput)[] = [];

    sockets.push(...this.inputs);

    sockets.push(...this.outputs);

    return sockets;
  }

  updateInput(input: NodeInput, data: unknown) {
    this.inputData[this.inputs.indexOf(input)] = data;
    this.update();
  }

  setInput(index: number, data: unknown) {
    this.inputData[index] = data;
    this.update();
  }

  setInputs(inputs: unknown[]) {
    this.inputData = inputs;
    this.update();
  }

  _update(inputData: unknown[], state: unknown) {
    this.computedData = this._compute(inputData, state);

    this.emit('computedData', this.computedData);

    this.refs.forEach((ref) => {
      if (Array.isArray(ref.indexIn)) {
        ref.indexIn.forEach((indexIn) => {
          ref.node.inputData[indexIn] = this.computedData;
        });
        ref.node.update();
      } else {
        ref.node.setInput(ref.indexIn, this.computedData);
      }
    });
  }

  remove() {
    if (this._unsubscribeNodeMove) this._unsubscribeNodeMove();
    this.system.removeNode(this);
  }

  connectTo(node: Node, indexOut = 0, indexIn = 0): NodeConnection {
    const output = this.outputs[indexOut];

    const input = node.inputs[indexIn];

    const connection = new NodeConnection(this.system, { output, input });

    // Check if node already has a connection to this node

    const existingRef = this.refs.find(
      (ref) => ref.node.id === node.id && ref.indexOut === indexOut,
    );

    if (existingRef) {
      if (Array.isArray(existingRef.indexIn)) {
        existingRef.indexIn = [...existingRef.indexIn, indexIn];
      } else {
        existingRef.indexIn = [existingRef.indexIn, indexIn];
      }
    } else {
      this.refs.push({ node, indexIn, indexOut });
    }

    this.update();

    return connection;
  }

  disconnectFrom(node: Node, indexOut = 0, indexIn = 0) {
    this.refs = this.refs.filter((ref) => {
      if (Array.isArray(ref.indexIn)) {
        ref.indexIn.splice(ref.indexIn.indexOf(indexIn), 1);
        if (ref.indexIn.length === 0) return false;
        if (ref.indexIn.length === 1) ref.indexIn = ref.indexIn[0];
        return true;
      }

      return !(
        ref.node.id === node.id &&
        ref.indexIn === indexIn &&
        ref.indexOut === indexOut
      );
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
