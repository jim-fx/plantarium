import { EventEmitter, memoize } from '@plantarium/helpers';
import type NodeView from '../view/NodeView';
import NodeConnection from './NodeConnection';
import type NodeOutput from './NodeOutput';
import type NodeState from './NodeState';
import type NodeSystem from './NodeSystem';

export default class Node extends EventEmitter {
  system: NodeSystem;

  id: string;
  attributes: NodeAttributes;

  outputs: NodeOutput[] = [];

  _state = {};
  states: {
    [key: string]: NodeState;
  } = {};

  inputData: unknown[] = [];
  computedData: unknown;

  view!: NodeView;

  wrapper!: HTMLDivElement;

  enableUpdates = true;
  _compute: (state: { [key: string]: unknown }) => unknown;

  refs: { node: Node; keyIn: string[]; indexOut: number }[] = [];

  constructor(system: NodeSystem, props: NodeProps) {
    super();

    this.system = system;

    const { attributes, state = {} } = props;
    this._state = state;
    this.attributes = attributes;
    this.id = attributes.id;

    this._compute = memoize((_state = this._state) => this.compute(_state));
  }

  get state() {
    return this._state;
  }

  bindView(view: NodeView) {
    this.view = view;

    this.outputs.forEach((o) => o.bindView());
    Object.values(this.states).forEach((i) => i.bindView());
  }

  setAttributes(attrib: Partial<NodeAttributes>) {
    if (this.enableUpdates) {
      this.system.history.addAction();
    }

    this.attributes = { ...this.attributes, ...attrib };
    this?.view.updateViewPosition();
    this.save();
  }

  compute(paramaters: unknown): unknown {
    return paramaters;
  }

  getChildren() {
    const outConnections = this.outputs.map((o) => o.connections).flat();

    const childNodes = outConnections.map((c) => c.input.node);

    return childNodes;
  }

  getSockets() {
    return [...this.getInputs(), ...this.outputs];
  }

  getInputs() {
    return Object.values(this.states)
      .map((s) => s.getInput())
      .filter((s) => !!s);
  }

  setStateValue(key: string, value: unknown) {
    this.states[key].setValue(value);
  }

  getStateValue(key: string): unknown {
    return this.state[key];
  }

  update() {
    if (!this.enableUpdates) return;
    if (this.system.options.showUpdates && this.view) {
      this.view.showUpdate();
    }

    this.computedData = this._compute(this.state);

    this.emit('computedData', this.computedData);

    //Update downstream nodes
    this.refs.forEach((ref) => {
      ref.node.enableUpdates = false;
      ref.keyIn.forEach((keyIn) => {
        ref.node.setStateValue(keyIn, this.computedData);
      });
      ref.node.enableUpdates = true;
      ref.node.update();
    });

    this.save();
  }

  remove() {
    this.system.removeNode(this);
    this.destroyEventEmitter();
  }

  connectTo(
    node: Node,
    indexOut = 0,
    keyIn: string = node.getInputs()[0].key,
  ): NodeConnection {
    const output = this.outputs[indexOut];

    const input = node.states[keyIn]?.getInput();
    if (!input) return;

    const connection = new NodeConnection(this.system, { output, input });

    output?.view?.updatePosition();
    input?.view?.updatePosition();

    // Check if node already has a connection to this node

    const existingRef = this.refs.find(
      (ref) => ref.node.id === node.id && ref.indexOut === indexOut,
    );

    if (existingRef) {
      existingRef.keyIn = [...existingRef.keyIn, keyIn];
    } else {
      this.refs.push({ node, keyIn: [keyIn], indexOut });
    }

    this.update();

    return connection;
  }

  disconnectFrom(node: Node, keyIn: string, indexOut: number) {
    //TODO: theres something missing here
    this.refs = this.refs.filter((ref) => {
      if (ref.indexOut !== indexOut) return false;
      ref.keyIn.splice(ref.keyIn.indexOf(keyIn), 1);
      if (ref.keyIn.length === 0) return false;
      return true;
    });

    this.update();
  }

  deserialize() {
    const attributes = Object.assign({}, this.attributes);

    attributes.refs = this.outputs
      .map((o) => o.connections)
      .flat()
      .map((c) => c.deserialize());

    const state = {};

    Object.values(this.states).forEach((s) => {
      state[s.key] = s.getValue();
    });

    return Object.assign(
      {},
      {
        attributes,
        state,
      },
    );
  }

  save() {
    this.system.save();
  }
}
