import './NodeSystemView.scss';
import { EventEmitter, throttle } from '@plantarium/helpers';
import { createPanZoom } from '../helpers';
import type Node from '../model/Node';
import type NodeInput from '../model/NodeInput';
import type NodeOutput from '../model/NodeOutput';
import type NodeSystem from '../model/NodeSystem';
import AddMenu from './AddMenu';
import BoxSelection from './BoxSelection';
import FloatingConnectionView from './FloatingConnectionView';
import ColorStore from './socketColorStore';
import type { NodeProps } from '../types';
import visible from '../helpers/visible';

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

  x = window.innerWidth / 2;
  y = window.innerHeight / 2;
  s = 1;

  mx = 0;
  my = 0;
  mdx = 0;
  mdy = 0;

  /**
   * Unprojected mouse x coordinate
   */
  rmx = 0;
  /**
   * Unprojected mouse y coordinate
   */
  rmy = 0;

  ev: MouseEvent;

  mouseDown = false;

  keyMap: { [key: string]: boolean } = {};

  activeNode: Node | undefined;
  selectedNodes: Node[] = [];
  selectedNodesDown: [number, number][] = [];

  clipboard: NodeProps[] = [];

  panzoom: ReturnType<typeof createPanZoom>;

  dpr: number;

  constructor(system: NodeSystem) {
    super();

    this.system = system;

    this.wrapper = system.options?.wrapper ?? document.createElement('div');
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
    //The next line works on some browsers but pt all
    this.svg.style.transform = `scale(${window.devicePixelRatio ?? 1})`;
    this.transformWrapper.appendChild(this.svg);

    this.addMenu = new AddMenu(this);
    this.boxSelection = new BoxSelection(this);
    this.boxSelection.on('selection', (nodes: Node[]) => {
      this.selectedNodes = nodes;
    });

    this.dpr = window.devicePixelRatio ?? 1;

    this.bindEventListeners();
    this.handleResize();

    visible(() => {
      setTimeout(() => {
        this.handleResize()
        this.system.nodes.forEach(n => {
          n.view.updateViewPosition()
        })
      }, 500)
    })
  }

  createFloatingConnection(socket: NodeInput | NodeOutput) {
    const floatingConnection = new FloatingConnectionView(socket, {
      x: this.mx,
      y: this.my,
    });
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
          state: {},
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

  projectLocalToWindow(x: number, y: number) {
    //Offset coords
    const offsetX = x + this.x;
    const offsetY = y + this.y;

    //Scaled coords
    const scaledX = offsetX * this.s;
    const scaledY = offsetY * this.s;

    return { x: scaledX, y: scaledY };
  }

  projectWindowToLocal(x: number, y: number) {
    //Offset coords
    const offsetX = x - this.x;
    const offsetY = y - this.y;
    //Scaled coords
    const scaledX = offsetX / this.s;
    const scaledY = offsetY / this.s;

    return { x: scaledX, y: scaledY };
  }

  setTransform({ x = this.x, y = this.y, s = this.s } = {}) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.panzoom.setTransform(x, y, s);

  }

  private showAddMenu() {
    this.addMenu
      .show({
        x: this.rmx,
        y: this.rmy,
      })
      .then((props) => {
        const node = this.system.createNode(props);
        this.setActive(node);
      })
      .catch();
  }

  bindEventListeners() {
    window.addEventListener('keydown', (ev) => this.handleKeyDown(ev));
    window.addEventListener('keyup', (ev) => this.handleKeyUp(ev));
    this.wrapper.addEventListener('mousemove', (ev) =>
      this.handleMouseMove(ev),
    );

    this.wrapper.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      this.showAddMenu();
    });

    this.wrapper.addEventListener('mousedown', (ev) =>
      this.handleMouseDown(ev),
    );
    this.wrapper.addEventListener('touchdown', (ev: MouseEvent) =>
      this.handleMouseDown(ev),
    );
    this.wrapper.addEventListener('mouseup', (ev) => this.handleMouseUp(ev));

    window.addEventListener(
      'resize',
      throttle(() => this.handleResize(), 10),
    );

    this.panzoom = createPanZoom(this.transformWrapper, {
      minZoom: 0.2,
      maxZoom: 5,
      onTransform: ({ x, y, scale: s }) => {
        this.x = x;
        this.y = y;
        this.s = s;
        const alpha = (s - 0.2) / 5 / 2;
        const sx = s * this.height * 0.02;
        const sy = s * this.width * 0.02;
        this.wrapper.style.setProperty('--scale', Math.abs(alpha) + '');
        this.wrapper.style.setProperty('--scale-x', sx + '%');
        this.wrapper.style.setProperty('--scale-y', sy + '%');
        this.wrapper.style.setProperty('--pos-x', `${x}px`);
        this.wrapper.style.setProperty('--pos-y', `${y}px`);
        this.system.setMetaData({ transform: { x, y, s } });
      },
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

  handleMouseMove(ev: MouseEvent) {
    this.ev = ev;
    const { clientX, clientY, shiftKey, ctrlKey } = ev;

    this.rmx = clientX - this.left;
    this.rmy = clientY - this.top;

    const { x, y } = this.projectWindowToLocal(this.rmx, this.rmy);

    this.mx = x;
    this.my = y;

    this.emit('mousemove', {
      x,
      y,
      mx: this.rmx,
      my: this.rmy,
      keys: { ...this.keyMap, shiftKey, ctrlKey },
    });
  }

  handleMouseDown(ev: MouseEvent) {
    const { shiftKey, ctrlKey, clientX, clientY, button, target } = ev;

    if (!shiftKey) this.setActive();

    if (ev['path'] && ![...ev['path']].includes(this.addMenu.wrapper)) {
      this.addMenu.hide();
      ev.preventDefault();
    }

    this.mouseDown = true;

    this.rmx = clientX - this.left;
    this.rmy = clientY - this.top;

    const { x, y } = this.projectWindowToLocal(this.rmx, this.rmy);

    this.selectedNodesDown = this.selectedNodes.map((_n) => [
      _n.view.x,
      _n.view.y,
    ]);

    this.emit('mousedown', {
      x,
      y,
      mx: this.rmx,
      my: this.rmy,
      target,
      keys: {
        ...this.keyMap,
        shiftKey,
        ctrlKey,
        button,
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

  handleKeyDown({ key, ctrlKey, shiftKey }: KeyboardEvent) {
    key = key === ' ' ? 'space' : key.toLowerCase();
    this.keyMap[key && key.toLowerCase()] = true;
    if (key === 'space') {
      this.ev && this.handleMouseDown(this.ev);
    }
    switch (key) {
      case 'escape':
        this.addMenu.hide();
        break;
      case 'a':
        if (shiftKey) {
          this.showAddMenu();
        }
        break;
      case 'c':
        if (shiftKey && ctrlKey) {
          if (window.confirm("Clear Storage?")) {
            localStorage.clear();
            window.location.reload();
          }
        } else if (ctrlKey) {
          const s = this.selectedNodes.splice(0);
          if (this.activeNode && !s.includes(this.activeNode))
            s.push(this.activeNode);
          this.clipboard = s.map((n) => n.deserialize()).map(n => {
            n.attributes.pos.x -= this.mx;
            n.attributes.pos.y -= this.my;
            return n
          });
        } else if (this.selectedNodes.length && this.activeNode) {
          this.selectedNodes[0].connectTo(this.activeNode);
        }
        break;
      // f
      case 'f':
        this.setTransform({ x: 0, y: 0, s: 1 });
        break;
      // g
      case 'g':
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
      case 'x':
        if (this.activeNode) {
          if (ctrlKey) {
            this.system.spliceNode(this.activeNode);
            this.selectedNodes.forEach((n) => this.system.spliceNode(n));
          } else {
            this.system.removeNode(this.activeNode);
            this.selectedNodes.forEach((n) => n.remove());
          }
        }
        break;
      // z
      case 'z':
        if (this.system.history) {
          if (ctrlKey) {
            if (shiftKey) {
              this.system.history.redo();
            } else {
              this.system.history.undo();
            }
          }
        }
        break;
      // l
      case 'l':
        // TODO: implement new log
        if (this.activeNode) {
          // eslint-disable-next-line no-console
          console.log(this.activeNode);
          // eslint-disable-next-line no-console
          console.log(this.activeNode.deserialize());
        }
        break;
      // v
      case 'v':
        if (ctrlKey) {


          this.clipboard
            .map((node) => {
              const { pos: { x = 0, y = 0 } = {} } = node.attributes;

              node.attributes.pos = {
                x: x + this.mx,
                y: y + this.my,
              };

              return node;
            })
            .forEach((c) => this.system.createNode(c));
        }
        break;
    }

    this.emit('keydown', { key, keys: { ...this.keyMap, ctrlKey } });
  }
}