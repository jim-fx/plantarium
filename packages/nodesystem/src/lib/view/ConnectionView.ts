import type NodeInput from '../model/NodeInput';
import type NodeOutput from '../model/NodeOutput';
import type NodeSystem from '../model/NodeSystem';
import './ConnectionView.scss';

const minMax = (min: number, max: number) => (num: number) =>
  Math.min(Math.max(num, min), max);

const limitDecimals = (amountDecimals: number) => {
  const amount = 10 ** amountDecimals;
  return (num) => Math.floor(num * amount) / amount;
};

const limitSafe = minMax(-100000, 100000);
const removeDecimals = limitDecimals(1);

const limit = (num: number) => limitSafe(removeDecimals(num));

export default class ConnectionView {
  path: SVGPathElement;
  hoverPath: SVGPathElement;
  system: NodeSystem;
  svg: SVGElement;

  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;

  constructor(
    { x1 = 0, y1 = 0, x2 = 0, y2 = 0 },
    socket: NodeOutput | NodeInput,
  ) {
    this.x1 = x2;
    this.y1 = y2;
    this.x2 = x1;
    this.y2 = y1;

    this.system = socket.node.system;

    this.svg = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    ) as SVGElement;
    this.svg.setAttribute('viewbox', '0 0 100 100');
    this.svg.setAttribute('width', '100');
    this.svg.setAttribute('height', '100');
    this.svg.style.overflow = 'visible';
    this.svg.style.position = 'absolute';
    this.svg.style.top = '3.5px';
    this.svg.style.pointerEvents = 'none';
    this.svg.style.zIndex = '-2';
    socket.view.wrapper.append(this.svg);

    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.classList.add('node-connection-path');
    this.path.setAttribute('vector-effect', 'non-scaling-stroke');
    this.path.setAttribute(
      'd',
      `
      M 0 0
      C 50 0 
        50 100
				100  100
      `,
    );
    this.svg.appendChild(this.path);

    this.setPosition();
  }

  setPosition({ x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2 } = {}) {
    this.x1 = limit(x1);
    this.y1 = limit(y1);
    this.x2 = limit(x2);
    this.y2 = limit(y2);

    const width = this.x1 - this.x2;
    const height = this.y1 - this.y2;

    this?.hoverPath?.setAttribute(
      'd',
      `
      M 0 0
      C ${width / 2} 0 
        ${width / 2} ${height}
				${width}  ${height}
      `,
    );

    this.path.setAttribute(
      'd',
      `
      M 0 0
      C ${width / 2} 0 
        ${width / 2} ${height}
				${width}  ${height}
      `,
    );
  }

  remove() {
    this.path.remove();
    this?.hoverPath?.remove();
    this.system.save();
  }
}
