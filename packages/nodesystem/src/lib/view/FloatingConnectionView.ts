import { aggregate, EventEmitter } from '@plantarium/helpers';
import type NodeConnection from '../model/NodeConnection';
import NodeInput from '../model/NodeInput';
import NodeOutput from '../model/NodeOutput';
import { SocketType, type CustomMouseEvent } from '../types';
import ConnectionView from './ConnectionView';
import type NodeSystemView from './NodeSystemView';

type EventMap = {
  connection: {
    output: NodeInput;
    input: NodeOutput;
  };
  remove: void;
};

interface FloatingConnectionView
  extends ConnectionView,
  EventEmitter<EventMap> { }

class FloatingConnectionView extends aggregate(ConnectionView, EventEmitter) {
  socket: NodeInput | NodeOutput;
  view: NodeSystemView;
  allSockets: (NodeInput | NodeOutput)[];
  potentialSockets: (NodeInput | NodeOutput)[];
  hoveredSocket: (NodeInput | NodeOutput) | undefined;
  isInput: boolean;
  isRightClick!: boolean;

  mdx: number;
  mdy: number;

  dx2: number;
  dy2: number;

  private _unsubMouseUp: () => void;
  private _unsubMouseMove: () => void;

  constructor(
    socket: NodeInput | NodeOutput,
    point: { x?: number; y?: number } = {},
  ) {
    const { system } = socket.node;

    super({}, socket);

    this.view = system.view;

    this.path.style.zIndex = '999';

    const type = Array.isArray(socket.type) ? socket.type[0] : socket.type;

    system.view.colorStore.onType(type, (color) => {
      this.path.style.stroke = color;
    });

    socket.view.updatePosition();

    const x2 = socket.view.x;
    const y2 = socket.view.y;

    let x1 = x2;
    let y1 = y2;

    if (point) {
      x1 = point.x - system.view.width / 2;
      y1 = point.y - system.view.height / 2;
    }

    this.setPosition({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    });

    this.dx2 = this.x1;
    this.dy2 = this.y1;

    this.isInput = socket._type === SocketType.INPUT;

    // Get all potential sockets from NodeSystem
    this.allSockets =
      socket instanceof NodeInput
        ? system.getOutputs(socket.type)
        : system.getInputs(socket.type);

    this.allSockets.forEach((s) => (s.view.state = 'potential'));

    // Filter out sockets on own node
    let potentialSockets = this.allSockets.filter(
      (s) => s.node.attributes.id !== socket.node.attributes.id,
    );
    potentialSockets.forEach((s) => (s.view.state = 'middle'));

    this.system.view.setState('floating');

    // -- Filter out already connected sockets;
    // get current connection(s) of socket
    const connections: NodeConnection[] =
      'connection' in socket ? [socket.connection] : socket.connections;
    // check if the socket even has any connection(s)
    if (connections && !!connections.length) {
      // get all the sockets of the connection
      const connectedSockets = connections
        .filter(Boolean)
        .map((c) => [c.input, c.output])
        .flat();
      // filter out all the sockets which are already connected
      potentialSockets = potentialSockets.filter(
        (s) => !connectedSockets.includes(s),
      );
    }

    potentialSockets.forEach((s) => s.view.updatePosition());
    this.potentialSockets = potentialSockets;

    // Set all the states on the sockets;
    // this.potentialSockets.forEach((s) => s.view.updatePosition());
    this.potentialSockets.forEach((s) => (s.view.state = 'highlight'));

    this._unsubMouseUp = this.view.on('mouseup', (ev) =>
      this.handleMouseUp(ev),
    );
    this._unsubMouseMove = this.view.on('mousemove', (ev) =>
      this.handleMouseMove(ev),
    );

    this.mdx = this.view.mx;
    this.mdy = this.view.my;

    this.socket = socket;
    socket.view.updatePosition();
  }

  handleMouseUp(ev: CustomMouseEvent) {
    const { x, y, keys } = ev;
    this._unsubMouseUp();
    this._unsubMouseMove();

    this.allSockets.forEach((s) => (s.view.state = ''));

    if (this.hoveredSocket) {
      this.emit('connection', {
        output: this.isInput ? this.socket : this.hoveredSocket,
        input: this.isInput ? this.hoveredSocket : this.socket,
      });

      this.remove();
    } else if (keys.ctrlKey) {
      this.view.addMenu
        .show({ x, y, socket: this.socket })
        .then((props) => this.view.system.createNode(props))
        .then((node) => {
          if (this.socket instanceof NodeOutput) {
            this.socket.connectTo(node);
          } else {
            node.connectTo(this.socket);
          }
          this.remove();
        })
        .catch(() => {
          // Do nothing^
          this.remove();
        })
        .finally(() => {
          this.remove();
        });
    } else {
      this.remove();
    }
  }

  handleMouseMove(ev: CustomMouseEvent) {
    // Convert mouse (0 - width) coordinates to 0 to 1 coordinates
    // and apply the view offset
    // Convert the relative coordinates to 0 - 100 coordinates and center them
    const { x: mx, y: my } = ev;

    if (!this.mdx) {
      this.mdx = mx;
      this.mdy = my;
    }

    const x1 = this.dx2 + (mx - this.mdx);
    const y1 = this.dy2 + (my - this.mdy);

    const distance = 20;

    const p = this.potentialSockets
      .map((socket) => {
        const { x, y } = socket.view;
        return {
          socket,
          distance: Math.abs(x1 - x) + Math.abs(y1 - y),
        };
      })
      .filter((s) => {
        return s.distance < distance;
      })
      .sort((a, b) => {
        return a.distance > b.distance ? -1 : 1;
      })
      .map((s) => s.socket);

    if (p.length) {
      const { x: _x2, y: _y2 } = p[0].view;
      this.hoveredSocket = p[0];
      this.setPosition({ x1: _x2, y1: _y2 });
    } else {
      this.hoveredSocket = undefined;
      this.setPosition({ x1, y1 });
    }
  }

  remove() {
    super.remove();
    this.emit('remove');
    this.system.view.setState('normal');
    this.system.isPaused = false;
  }
}

export default FloatingConnectionView;
