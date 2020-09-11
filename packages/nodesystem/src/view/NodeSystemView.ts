import './NodeSystemView.scss';

import AddMenu from './AddMenu';
import FloatingConnectionView from './FloatingConnectionView';
import { EventEmitter, throttle } from '@plantarium/helpers';
import NodeSystem from 'model/NodeSystem';
import NodeInput from 'model/NodeInput';
import Node from 'model/Node';
import NodeOutput from 'model/NodeOutput';
import BoxSelection from './BoxSelection';
import ColorStore from './socketColorStore';

export default class NodeSystemView extends EventEmitter {
  system: NodeSystem;
  wrapper: HTMLElement;
  transformWrapper: HTMLDivElement;
  svg: SVGElement;
  addMenu: AddMenu;
  boxSelection: BoxSelection;
  colorStore = new ColorStore();

  nodeContainer: HTMLDivElement;

  width = 0;
  height = 0;

  top = 0;
  left = 0;

  x = 0;
  y = 0;
  dx = 0;
  dy = 0;
  s = 1;
  ds = 1;

  mx = 0;
  my = 0;
  mdx = 0;
  mdy = 0;

  ogWidth = 0;
  ogHeight = 0;

  mouseDown = false;

  keyMap: { [key: string]: boolean } = {};

  activeNode: Node | undefined;
  selectedNodes: Node[] = [];
  selectedNodesDown: [number, number][] = [];

  clipboard: NodeProps[] = [];

  constructor(system: NodeSystem) {
    super();

    this.system = system;

    this.wrapper = system.options?.wrapper || document.createElement('div');
    this.wrapper.classList.add('nodesystem-wrapper');
    if (system.options.parent) {
      system.options.parent.appendChild(this.wrapper);
    }

    this.transformWrapper = document.createElement('div');
    this.transformWrapper.classList.add('nodesystem-transform');
    this.wrapper.appendChild(this.transformWrapper);

    this.nodeContainer = document.createElement('div');
    this.nodeContainer.classList.add('nodes-container');
    this.transformWrapper.append(this.nodeContainer);

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 1 1');
    this.svg.setAttribute('height', '1');
    this.svg.setAttribute('width', '1');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    this.transformWrapper.appendChild(this.svg);

    this.addMenu = new AddMenu(this);
    this.boxSelection = new BoxSelection(this);
    this.boxSelection.on('selection', (nodes: Node[]) => {
      this.selectedNodes = nodes;
    });

    this.bindEventListeners();
    this.handleResize();

    this.ogHeight = this.height;
    this.ogWidth = this.width;
  }

  createFloatingConnection(
    socket: NodeInput | NodeOutput,
    point?: { x: number; y: number },
  ) {
    const floatingConnection = new FloatingConnectionView(socket, point);
    floatingConnection.once(
      'connection',
      ({
        inputNode,
        outputNode,
        keyIn,
        indexOut,
      }: {
        inputNode: Node;
        outputNode: Node;
        keyIn: string;
        indexOut: number;
      }) => {
        outputNode.connectTo(inputNode, indexOut, keyIn);
      },
    );
  }

  setActive(n?: Node | undefined, { shiftKey = false, ctrlKey = false } = {}) {
    if (!n) {
      if (this.activeNode) {
        this.activeNode.view.state = 'normal';
        this.activeNode = undefined;
      }
      this.selectedNodes.forEach((s) => (s.view.state = 'normal'));
      this.selectedNodes = [];
    } else if (shiftKey && ctrlKey) {
      if (this.activeNode) {
        this.activeNode.view.state = 'normal';
        this.activeNode = undefined;
      }

      this.activeNode = n;
      this.activeNode.view.state = 'active';

      if (this.activeNode.outputs.length) {
        const debugNode = this.system.createNode({
          state: [],
          attributes: {
            type: 'debug',
            id: '0',
            name: 'debug',
            refs: [],
            pos: {
              x: this.activeNode.view.x + this.activeNode.view.width + 10,
              y: this.activeNode.view.y,
            },
          },
        });

        debugNode.enableUpdates = true;

        this.activeNode.connectTo(debugNode, 0, 'input');
      }
    } else if (shiftKey) {
      if (!this.activeNode) {
        this.activeNode = n;
        this.activeNode.view.state = 'active';
      } else {
        this.selectedNodes.push(this.activeNode);
        this.activeNode.view.state = 'selected';
        this.activeNode = n;
        this.activeNode.view.state = 'active';
      }
    } else {
      if (this.activeNode) {
        this.selectedNodes.forEach((s) => (s.view.state = 'normal'));
        this.selectedNodes = [];
        if (this.activeNode !== n) {
          this.activeNode.view.state = 'normal';
          this.activeNode = n;
          this.activeNode.view.state = 'active';
        }
      } else {
        this.activeNode = n;
        this.activeNode.view.state = 'active';
      }
    }
  }

  getSelectedNodes() {
    if (this.activeNode && this.selectedNodes.includes(this.activeNode)) {
      return this.selectedNodes;
    } else {
      if (this.activeNode) {
        return [...this.selectedNodes, this.activeNode];
      } else {
        return [...this.selectedNodes];
      }
    }
  }

  convertRelativeToAbsolute(x: number, y: number) {
    //Offset coords
    const offsetX = x + this.x;
    const offsetY = y + this.y;

    //Scaled coords
    const scaledX = offsetX * this.s;
    const scaledY = offsetY * this.s;

    //center Coords
    const centerX = scaledX + this.width / 2;
    const centerY = scaledY + this.height / 2;

    return { x: centerX, y: centerY };
  }

  convertAbsoluteToRelative(x: number, y: number) {
    //center Coords
    const centerX = x - this.width / 2;
    const centerY = y - this.height / 2;

    //Scaled coords
    const scaledX = centerX / this.s;
    const scaledY = centerY / this.s;

    //Offset coords
    const offsetX = scaledX - this.x;
    const offsetY = scaledY - this.y;

    return { x: offsetX, y: offsetY };
  }

  setTransform({ x = this.x, y = this.y, s = this.s } = {}) {
    this.x = x;
    this.y = y;
    this.s = s;

    const one = s * 100;
    const four = s * 4;

    this.wrapper.style.backgroundSize = `1px ${one}px, ${one}px ${one}px, ${four}px ${four}px, ${four}px ${four}px`;

    this.wrapper.style.backgroundPosition = `${this.width / 2 + x}px ${
      this.height / 2 + y
    }px`;

    this.transformWrapper.style.transform = `
      translateX(${x}px)
      translateY(${y}px)
      scale(${s})
    `;

    this.emit('transform', { x, y, s });
  }

  bindEventListeners() {
    document.addEventListener('keydown', (ev) => this.handleKeyDown(ev));
    document.addEventListener('keyup', (ev) => this.handleKeyUp(ev));
    this.wrapper.addEventListener(
      'mousemove',
      throttle((ev) => this.handleMouseMove(ev), 10),
    );
    this.wrapper.addEventListener('mousedown', (ev) =>
      this.handleMouseDown(ev),
    );
    this.wrapper.addEventListener('mouseup', (ev) => this.handleMouseUp(ev));
    window.addEventListener(
      'resize',
      throttle(() => this.handleResize(), 10),
    );
    this.wrapper.addEventListener(
      'wheel',
      throttle((ev) => this.handleScroll(ev), 10),
    );
  }

  handleMouseMove({ clientX, clientY, shiftKey, ctrlKey, which }: MouseEvent) {
    // e = Mouse click event.
    const x = clientX - this.left; //x position within the element.
    const y = clientY - this.top; //y position within the element.

    this.mx = x;
    this.my = y;

    let vx = 0;
    let vy = 0;

    if (this.mouseDown) {
      vx = (this.mdx - x) / this.s;
      vy = (this.mdy - y) / this.s;
      if (this.keyMap.space || which === 2) {
        this.setTransform({
          x: this.dx - vx,
          y: this.dy - vy,
        });
      }
    }

    if (this.selectedNodes.length) {
      if (this.keyMap.g || this.mouseDown) {
        if (this.selectedNodes.length) {
          this.selectedNodes.forEach((_n, i) =>
            _n.view.setPosition(
              this.selectedNodesDown[i][0] - vx,
              this.selectedNodesDown[i][1] - vy,
            ),
          );
        }
      }
    }

    this.emit('mousemove', {
      x,
      y,
      keys: { ...this.keyMap, shiftKey, ctrlKey, which },
    });
  }

  handleResize() {
    const { width, height, top, left } = this.wrapper.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.top = top;
    this.left = left;
    this.emit('resize', { width, height });
  }

  handleMouseDown(ev: MouseEvent) {
    const { shiftKey, ctrlKey, clientX, clientY, which } = ev;

    if (!shiftKey) this.setActive();

    const x = clientX - this.left; //x position within the element.
    const y = clientY - this.top; //y position within the element.

    this.mouseDown = true;
    this.mdx = x;
    this.mdy = y;

    this.dx = this.x;
    this.dy = this.y;
    this.ds = this.s;

    this.selectedNodesDown = this.selectedNodes.map((_n) => [
      _n.view.x,
      _n.view.y,
    ]);

    this.emit('mousedown', {
      x,
      y,
      keys: {
        ...this.keyMap,
        shiftKey,
        ctrlKey,
        which,
      },
    });
  }

  handleMouseUp({ clientX, clientY, shiftKey, ctrlKey }: MouseEvent) {
    this.mouseDown = false;
    const x = clientX - this.left; //x position within the element.
    const y = clientY - this.top; //y position within the element.

    this.emit('mouseup', {
      x,
      y,
      keys: {
        ...this.keyMap,
        shiftKey,
        ctrlKey,
      },
    });
  }

  handleKeyUp({ key }: KeyboardEvent) {
    if (key === ' ') key = 'space';
    delete this.keyMap[key && key.toLowerCase()];
    this.emit('keyup', { key, keys: this.keyMap });
  }

  handleKeyDown({ key, keyCode, ctrlKey, shiftKey }: KeyboardEvent) {
    if (key === ' ') key = 'space';
    switch (keyCode) {
      // shift + a
      case 65:
        if (shiftKey) {
          this.addMenu
            .show({ x: this.mx, y: this.my })
            .then((props) => {
              this.system.createNode(props);
            })
            .catch();
        }
        break;
      // c
      case 67:
        if (shiftKey && ctrlKey) {
          localStorage.clear();
          window.location.reload();
        } else if (ctrlKey) {
          const s = this.selectedNodes.splice(0);
          if (this.activeNode && !s.includes(this.activeNode))
            s.push(this.activeNode);
          this.clipboard = s.map((n) => n.deserialize());
        } else if (this.selectedNodes.length && this.activeNode) {
          this.selectedNodes[0].connectTo(this.activeNode);
        }
        break;
      // f
      case 70:
        this.setTransform({ x: 0, y: 0, s: 1 });
        break;
      // g
      case 71:
        if (!this.keyMap.g) {
          this.mdx = this.mx;
          this.mdy = this.my;
          this.selectedNodesDown = this.selectedNodes.map((_n) => [
            _n.view.x,
            _n.view.y,
          ]);
        }
        break;
      // x
      case 88:
        if (this.activeNode) this.system.removeNode(this.activeNode);
        this.selectedNodes.forEach((n) => n.remove());
        break;
      // z
      case 90:
        break;
      // l
      case 76:
        // TODO: implement new log
        if (this.activeNode) {
          console.log(this.activeNode);
          console.log(this.activeNode.deserialize());
        }
        break;
      // v
      case 86:
        if (ctrlKey) {
          const sorted = this.clipboard.sort((a, b) => {
            const { pos: { x: x1 = 0, y: y1 = 0 } = {} } = a.attributes;
            const { pos: { x: x2 = 0, y: y2 = 0 } = {} } = b.attributes;
            return x1 + y1 < x2 + y2 ? -1 : 1;
          });

          let {
            pos: { x: offsetX = 0, y: offsetY = 0 } = {},
          } = sorted[0].attributes;

          const { x: mx, y: my } = this.convertAbsoluteToRelative(
            this.mx,
            this.my,
          );

          offsetX -= mx;
          offsetY -= my;

          this.clipboard
            .map((prop) => {
              const { pos: { x = 0, y = 0 } = {} } = prop.attributes;

              prop.attributes.pos = {
                x: x - offsetX,
                y: y - offsetY,
              };
              return prop;
            })
            .forEach((c) => this.system.createNode(c));
        }
        break;
    }

    this.keyMap[key && key.toLowerCase()] = true;

    this.emit('keydown', { key, keys: { ...this.keyMap, ctrlKey } });
  }

  handleScroll({ deltaY }: WheelEvent) {
    const s = Math.min(Math.max(this.s - deltaY / 1000, 0.5), 4);
    this.setTransform({ s });
  }
}
