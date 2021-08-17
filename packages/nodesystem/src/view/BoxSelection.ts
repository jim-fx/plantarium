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

  downX = 0;
  downY = 0;

  isShiftKey = false;

  resolve!: (nodes: Node[]) => void;
  constructor(view: NodeSystemView) {
    super();

    this.view = view;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('box-selection-wrapper');
    this.view.wrapper.append(this.wrapper);

    this.view.on('mousedown', ({ target, mx, x, my, y, keys }) => {
      if (keys.space || keys.shiftKey || keys.button === 2 || !keys.ctrlKey)
        return;

      if (target && !target?.className?.includes('nodesystem')) return;

      this.mDownX = mx;
      this.mDownY = my;

      this.downX = x;
      this.downY = y;

      this.wrapper.style.left = mx + 'px';
      this.wrapper.style.top = my + 'px';
      this.wrapper.style.width = '0px';
      this.wrapper.style.height = '0px';

      this.isShiftKey = keys.shift;

      this.show();
    });
  }

  show() {
    this.wrapper.classList.add('box-selection-visible');

    const rects: HitBox[] = this.view.system.nodes.map((n) => {
      const { width, height } = n.view;

      const { x, y } = n.view;

      const x1 = x + this.view.width / 2;
      const y1 = y + this.view.height / 2;

      const x2 = x1 + width;
      const y2 = y1 + height;

      return {
        n,
        state: n.view.state,
        x1,
        y1,
        x2,
        y2,
      };
    });

    let nodes: Node[] = [];

    const unsubMove = this.view.on(
      'mousemove',
      ({ mx, my, x, y }) => {
        const { mDownX, mDownY, downX, downY, isShiftKey } = this;

        // UnProjected box for updateing html elemeent
        const box: Rect = {
          x1: Math.min(mx, mDownX),
          x2: Math.max(mx, mDownX),
          y1: Math.min(my, mDownY),
          y2: Math.max(my, mDownY),
        };

        this.wrapper.style.left = box.x1 + 'px';
        this.wrapper.style.top = box.y1 + 'px';

        this.wrapper.style.width = Math.abs(mDownX - mx) + 'px';
        this.wrapper.style.height = Math.abs(mDownY - my) + 'px';

        const projectedBox: Rect = {
          x1: Math.min(x, downX),
          x2: Math.max(x, downX),
          y1: Math.min(y, downY),
          y2: Math.max(y, downY),
        };

        nodes = rects
          .filter((r) => {
            if (rectanglesIntersect(projectedBox, r)) {
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

  private projectBox(b: Rect) {
    const { x: x1, y: y1 } = this.view.projectWindowToLocal(b.x1, b.y1);
    const { x: x2, y: y2 } = this.view.projectWindowToLocal(b.x2, b.y2);

    return {
      x1,
      y1,
      x2,
      y2,
    };
  }

  hide() {
    this.wrapper.classList.remove('box-selection-visible');
  }
}
