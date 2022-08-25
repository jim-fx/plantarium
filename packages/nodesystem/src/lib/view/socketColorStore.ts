import type NodeType from '../model/NodeType';
import { EventEmitter } from '@plantarium/helpers';
import type NodeSystemView from './NodeSystemView';

const COLORS = [
  { color: '#a52a2a', name: 'brown' },
  { color: '#008000', name: 'green' },
  { color: '#4b0082', name: 'indigo' },
  { color: '#f0e68c', name: 'khaki' },
  { color: '#add8e6', name: 'lightblue' },
  { color: '#e0ffff', name: 'lightcyan' },
  { color: '#90ee90', name: 'lightgreen' },
  { color: '#d3d3d3', name: 'lightgrey' },
  { color: '#ffb6c1', name: 'lightpink' },
  { color: '#ffffe0', name: 'lightyellow' },
  { color: '#00ff00', name: 'lime' },
  { color: '#ff00ff', name: 'magenta' },
  { color: '#800000', name: 'maroon' },
  { color: '#000080', name: 'navy' },
  { color: '#808000', name: 'olive' },
  { color: '#ffa500', name: 'orange' },
  { color: '#ffc0cb', name: 'pink' },
  { color: '#800080', name: 'purple' },
  { color: '#800080', name: 'violet' },
  { color: '#ff0000', name: 'red' },
  { color: '#c0c0c0', name: 'silver' },
  { color: '#ffffff', name: 'white' },
];

export default class ColorStore extends EventEmitter {
  colors: { [type: string]: string } = {};
  index = 0;
  constructor(view: NodeSystemView) {
    super();
    this.updateTypes(view.system.store.types);
    view.system.store.on('types', (nodeTypes: NodeType[]) =>
      this.updateTypes(nodeTypes),
    );
  }

  private updateTypes(nodeTypes: NodeType[]) {
    nodeTypes.forEach((t) => {
      t?.inputs?.forEach((s) =>
        Array.isArray(s)
          ? s.forEach((_s) => this.setType(_s))
          : this.setType(s),
      );
      t?.outputs?.forEach((s) => this.setType(s));
    });
  }

  setColors(colors: Record<string, string>) {
    for (const k in colors) {
      this.colors[k] = colors[k];
    }
  }

  private setType(socketType: string) {
    if (!socketType) return;
    if (!(socketType in this.colors)) {
      this.colors[socketType] = COLORS[this.index].color;
      this.index++;
    }
    this.emit(socketType, this.colors[socketType]);
    this.emit('colors', Object.entries(this.colors));
  }

  get(socketType: string) {
    return this.colors[socketType];
  }

  onType(socketType: string, cb: (color: string) => unknown) {
    this.setType(socketType);
    cb(this.colors[socketType]);
    return super.on(socketType, cb);
  }
}
