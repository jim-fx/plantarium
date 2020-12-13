import './ConnectionView.scss';

import type NodeSystem from '../model/NodeSystem';

const minMax = (min: number, max: number) => (num: number) =>
  Math.min(Math.max(num, min), max);

const limitSafe = minMax(-100000, 100000);

export default class ConnectionView {
  private path: SVGPathElement;
  private system: NodeSystem;

  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;

  constructor({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 }, system: NodeSystem) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.system = system;

    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.classList.add('node-connection-path');
    this.path.setAttribute('vector-effect', 'non-scaling-stroke');

    this.system.view.svg.append(this.path);

    this.setPosition();
  }

  setPosition({ x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2 } = {}) {
    this.x1 = limitSafe(x1);
    this.y1 = limitSafe(y1);
    this.x2 = limitSafe(x2);
    this.y2 = limitSafe(y2);

    const smoothness = 0.5;

    const c1x = limitSafe(x1 + (x2 - x1) * smoothness);
    const c1y = limitSafe(y1);

    const c2x = limitSafe(x1 + (x2 - x1) * (1 - smoothness));
    const c2y = limitSafe(y2);

    this.path.setAttribute(
      'd',
      `
      M ${this.x1}  ${this.y1}
      C ${c1x} ${c1y}
        ${c2x} ${c2y}
        ${this.x2}  ${this.y2}
      `,
    );
  }

  remove() {
    this.path.remove();
    this.system.save();
  }
}
