import { cloneObject, EventEmitter, memoize } from '@plantarium/helpers';
import {
  SocketType,
  type NodeAttributes,
  type NodeProps,
  type NodeTypeData,
} from '../types';
import type NodeView from '../view/NodeView';
import NodeConnection from './NodeConnection';
import type NodeInput from './NodeInput';
import type NodeOutput from './NodeOutput';
import type NodeState from './NodeState';
import type NodeSystem from './NodeSystem';

export default class Node extends EventEmitter {
  system: NodeSystem;

  id: string;
  attributes: NodeAttributes;
  meta: NodeTypeData['meta'];

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

  getOutConnections() {
    return this.outputs.map((out) => out.connections).flat();
  }

  getDownstreamNodes() {
    return Array.from(
      new Set(this.getOutConnections().map((c) => c.output.node)).values(),
    );
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

    if (
      Object.values(this.states).find((s) => !s.isOkay) ||
      this.system.options.deferCompute
    ) {
      this.computedData = undefined;
    } else {
      this.computedData = this._compute(this.state);
    }
    this.emit('computedData', this.computedData);

    //Update downstream nodes
    this.getOutConnections().forEach((c) => {
      c.output.node.enableUpdates = false;
      if (this.system.options.deferCompute) {
        c.output.setValue({
          type: this.attributes.type,
          parameters: this.computedData,
        });
      } else {
        c.output.setValue(this.computedData);
      }
      return c;
    });

    this.getDownstreamNodes().forEach((n) => {
      n.enableUpdates = true;
      n.update();
    });

    this.save();
  }

  remove() {
    this.system.removeNode(this);
    this.destroyEventEmitter();
  }

  connectTo(
    socket: NodeInput | NodeOutput | Node,
    out?: string | number,
  ): NodeConnection {
    if (socket instanceof Node) {
      if (socket === this) {
        return;
      }

      let inputs: NodeInput[];
      let outputs: NodeOutput[];

      if (this.attributes.pos.x > socket.attributes.pos.x) {
        inputs = this.getInputs();
        outputs = socket.outputs;
      } else {
        inputs = socket.getInputs();
        outputs = this.outputs;
      }

      for (const input of inputs) {
        const output = outputs.find((o) => input.canConnectTo(o));
        if (output && !input.connection) {
          return new NodeConnection(this.system, {
            input: output,
            output: input,
          });
        }
      }

      return;
    }

    if (socket._type === SocketType.OUTPUT) {
      const inputs = this.getInputs();

      if (typeof out === 'string') {
        const output = inputs[out];
        if (output) {
          return new NodeConnection(this.system, { input: socket, output });
        }
      }

      const output = inputs.find((i) => socket.canConnectTo(i));

      if (!output) {
        return;
      }
      return new NodeConnection(this.system, { input: socket, output });
    }

    if (socket._type === SocketType.INPUT) {
      const outputs = this.outputs;

      if (typeof out === 'number') {
        const output = outputs[out];
        if (!output) {
          return;
        }
        return new NodeConnection(this.system, {
          input: output,
          output: socket,
        });
      }

      const output = outputs.find((out) => socket.canConnectTo(out));

      if (!output) {
        return;
      }

      return new NodeConnection(this.system, { input: output, output: socket });
    }
  }

  disconnectFrom(node: Node, input?: NodeInput) {
    const outConnections = this.getOutConnections();

    if (!outConnections.length) return;

    if (node && input) {
      const conns = outConnections.filter((c) => c.output === input);
      conns.forEach((conn) => conn.remove());
      return;
    }

    if (node) {
      const conns = outConnections.filter((c) => c.output.node.id === node.id);
      conns.forEach((conn) => conn.remove());
      return;
    }

    this.update();
  }

  deserialize() {
    const attributes = {
      ...cloneObject(this.attributes),
      refs: this.getOutConnections().map((c) => c.deserialize()),
    };

    const state = {};

    Object.values(this.states).forEach((s) => {
      state[s.key] = s.getValue();
      if (s?.view?.hideable && s.view.visible) {
        if (!attributes.visible) attributes.visible = [];
        attributes.visible.push(s.key);
      }
      if (attributes.visible)
        attributes.visible = Array.from(new Set(attributes.visible).values());
    });

    return {
      attributes,
      state,
    };
  }

  save() {
    this.system.save();
  }
}
