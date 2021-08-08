import './BoxSelection.scss';
import { EventEmitter } from '@plantarium/helpers';
import type NodeSystemView from './NodeSystemView';
import type Node from '../model/Node';
import { rectanglesIntersect } from '../helpers';

interface HitBox extends Rect {
  n: Node;
  state?: string;
}

export default class BoxSelectionView extends EventEmitter {
  view: NodeSystemView;
  wrapper: HTMLDivElement;

  mDownX = 0;
  mDownY = 0;

  isShiftKey = false;

  resolve!: (nodes: Node[]) => void;
  constructor(view: NodeSystemView) {
    super();

    this.view = view;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('box-selection-wrapper');
    this.view.wrapper.append(this.wrapper);

    this.view.on('mousedown', ({ target, x, y, keys }) => {
      if (keys.space || keys.shift || keys.button === 2) return;

      if (target && !target?.className?.includes('nodesystem')) return;

      this.mDownX = x;
      this.mDownY = y;

      this.wrapper.style.left = x + 'px';
      this.wrapper.style.top = y + 'px';
      this.wrapper.style.width = '0px';
      this.wrapper.style.height = '0px';

      this.isShiftKey = keys.shift;

      this.show();
    });
  }

  show() {
    this.wrapper.classList.add('box-selection-visible');

    const { s } = this.view;

    const rects: HitBox[] = this.view.system.nodes.map((n) => {
      const { width, height } = n.view;

      const { x, y } = this.view.convertRelativeToAbsolute(n.view.x, n.view.y);

      return {
        n,
        state: n.view.state,
        x1: x,
        x2: x + (width / 2) * s,
        y1: y,
        y2: y + (height / 2) * s,
      };
    });

    let nodes: Node[] = [];

    const unsubMove = this.view.on(
      'mousemove',
      ({ x, y }) => {
        const { mDownX, mDownY, isShiftKey } = this;

        const box: Rect = {
          x1: Math.min(x, mDownX),
          x2: Math.max(x, mDownX),
          y1: Math.min(y, mDownY),
          y2: Math.max(y, mDownY),
        };

        this.wrapper.style.left = box.x1 + 'px';
        this.wrapper.style.top = box.y1 + 'px';

        this.wrapper.style.width = Math.abs(mDownX - x) + 'px';
        this.wrapper.style.height = Math.abs(mDownY - y) + 'px';

        nodes = rects
          .filter((r) => {
            if (rectanglesIntersect(box, r)) {
              return true;
            } else {
              if (!isShiftKey) {
                r.state = 'normal';
                r.n.view.state = 'normal';
              }
              return false;
            }
          })
          .map(({ n, state }) => {
            if (state !== 'active') {
              state = 'selected';
              n.view.state = 'selected';
            }

            return n;
          });
      },
      5,
    );

    this.view.once('mouseup', () => {
      unsubMove();
      this.hide();
      this.emit('selection', nodes);
    });
  }

  hide() {
    this.wrapper.classList.remove('box-selection-visible');
  }
}
