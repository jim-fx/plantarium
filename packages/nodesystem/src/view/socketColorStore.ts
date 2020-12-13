import { EventEmitter } from '@plantarium/helpers';

const COLORS = [
  { color: '#00ffff', name: 'aqua' },
  { color: '#f0ffff', name: 'azure' },
  { color: '#f5f5dc', name: 'beige' },
  { color: '#000000', name: 'black' },
  { color: '#0000ff', name: 'blue' },
  { color: '#a52a2a', name: 'brown' },
  { color: '#00ffff', name: 'cyan' },
  { color: '#00008b', name: 'darkblue' },
  { color: '#008b8b', name: 'darkcyan' },
  { color: '#a9a9a9', name: 'darkgrey' },
  { color: '#006400', name: 'darkgreen' },
  { color: '#bdb76b', name: 'darkkhaki' },
  { color: '#8b008b', name: 'darkmagenta' },
  { color: '#556b2f', name: 'darkolivegreen' },
  { color: '#ff8c00', name: 'darkorange' },
  { color: '#9932cc', name: 'darkorchid' },
  { color: '#8b0000', name: 'darkred' },
  { color: '#e9967a', name: 'darksalmon' },
  { color: '#9400d3', name: 'darkviolet' },
  { color: '#ff00ff', name: 'fuchsia' },
  { color: '#ffd700', name: 'gold' },
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
  constructor() {
    super();
  }

  private setType(socketType: string) {
    if (!(socketType in this.colors)) {
      this.colors[socketType] = COLORS[this.index].color;
      this.index++;
    }
    this.emit(socketType, this.colors[socketType]);
  }

  on(socketType: string, cb: (color: string) => any) {
    this.setType(socketType);
    cb(this.colors[socketType]);
    return super.on(socketType, cb);
  }
}
