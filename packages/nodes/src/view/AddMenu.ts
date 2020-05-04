import './AddMenu.scss';
import NodeSystemView from './NodeSystemView';
import NodeInput from 'model/NodeInput';
import NodeOutput from 'model/NodeOutput';
import NodeType from 'model/NodeType';
import NodeSystem from 'model/NodeSystem';
import Logger from 'model/Logger';

interface ContextOptions {
  x: number;
  y: number;
  socket?: NodeInput | NodeOutput;
}

class SearchContainer {
  menu: RightClickMenu;
  type: NodeType;
  children: SearchContainer[] = [];

  wrapper: HTMLDivElement;

  searchString: string;

  constructor(
    menu: RightClickMenu,
    type: NodeType,
    containers?: SearchContainer[],
  ) {
    this.menu = menu;
    this.type = type;
    if (containers) this.children.push(...containers);

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('search-container');

    const title = document.createElement('p');
    title.innerHTML = this.type.name;
    this.wrapper.appendChild(title);

    const s = [type.name];
    if (this.type.meta) {
      if (this.type.meta.description)
        s.push(this.type.meta.description.split(' ').join(':'));
      if (this.type.meta.tags) s.push(...this.type.meta.tags);
    }

    this.searchString = s.join(':').toLowerCase();
    this.menu.wrapper.appendChild(this.wrapper);
  }

  show() {
    this.wrapper.style.display = '';
  }

  hide() {
    this.wrapper.style.display = 'none';
  }

  blur() {
    this.wrapper.classList.remove('focused');
  }

  focus() {
    if (this.menu.activeContainer) this.menu.activeContainer.blur();
    this.menu.activeContainer = this;
    this.wrapper.classList.add('focused');
  }

  showIfSearch(search: string) {
    if (this.searchString.includes(search.toLowerCase())) {
      this.show();
      return true;
    } else {
      this.hide();
      return false;
    }
  }

  destroy() {
    this.wrapper.remove();
  }
}

export default class RightClickMenu {
  wrapper: HTMLDivElement;

  searchInput: HTMLInputElement;

  view: NodeSystemView;
  system: NodeSystem;

  x = 0;
  y = 0;
  visible = false;
  log: Logger;

  possibleContainers: SearchContainer[] = [];
  filteredContainers: SearchContainer[] = [];
  containers: SearchContainer[] = [];
  activeContainer?: SearchContainer;

  socket: NodeInput | NodeOutput | undefined;

  res!: (data: NodeProps) => void;
  rej!: () => void;

  constructor(view: NodeSystemView) {
    this.view = view;
    this.system = view.system;

    this.log = new Logger(this);

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('context-wrapper');

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search';

    this.wrapper.appendChild(this.searchInput);

    this.view.wrapper.append(this.wrapper);

    this.bindEventListeners();

    this.view.on('keydown', ({ key }) => key === 'Escape' && this.hide());
  }

  updateTypes(types: NodeType[]) {
    this.containers.forEach((c) => c.destroy());
    this.containers.push(
      ...types.map((type) => {
        return new SearchContainer(this, type);
      }),
    );
  }

  setActive(num: number) {
    const { length } = this.filteredContainers;

    if (!length) return;

    const curIndex = this.activeContainer
      ? this.filteredContainers.indexOf(this.activeContainer)
      : 0;

    const nextIndex = (((curIndex + num) % length) + length) % length;

    this.filteredContainers[nextIndex].focus();
    this.log.info(`Set active entry ${nextIndex}`);
  }

  bindEventListeners() {
    window.addEventListener('mousedown', (ev) => this.handleWindowClick(ev));

    this.view.system.store.on(
      'types',
      (types: NodeType[]) =>
        this.updateTypes(
          types.filter((type: NodeType) => type.name !== 'output'),
        ),
      20,
    );

    this.view.on('keydown', ({ key }) => {
      switch (key) {
        case 'Escape':
          this.reject();
          break;
        case 'ArrowDown':
          this.setActive(1);
          break;
        case 'ArrowUp':
          this.setActive(-1);
          break;
      }
    });

    this.searchInput.addEventListener('input', () => {
      const { value = '' } = this.searchInput;
      this.search(value);
    });
    this.searchInput.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode === 13 && this.activeContainer) {
        this.resolve();
      }
    });
  }

  handleWindowClick(ev: MouseEvent) {
    const path = ev.composedPath();
    if (this.visible && !path.includes(this.wrapper)) {
      this.reject();
    }
  }

  search(s?: string) {
    if (s && s.length) {
      const found = this.possibleContainers.filter((c) => c.showIfSearch(s));
      if (found.length === 0) {
        this.filteredContainers = [...this.possibleContainers];
        this.filteredContainers.forEach((c) => c.show());
      } else {
        this.filteredContainers = [...found];
        found[0].focus();
      }
      this.log.info(`Found ${found.length} entries for search:${s}`);
    } else {
      this.filteredContainers = [...this.possibleContainers];
      this.filteredContainers.forEach((c) => c.show());
    }
  }

  reject() {
    if (this.rej) this.rej();
    this.hide();
  }

  resolve() {
    const type = this.activeContainer?.type;

    if (type) {
      const { x, y } = this.system.view.convertAbsoluteToRelative(
        this.x,
        this.y,
      );

      this.res({
        attributes: {
          pos: {
            x,
            y,
          },
          id: '',
          name: type.name,
          type: type.name,
          refs: [],
        },
        state: {
          value: undefined,
        },
      });
    } else {
      this.reject();
    }

    this.hide();
  }

  hide() {
    this.visible = false;
    this.wrapper.classList.remove('context-visible');
    this.wrapper.blur();
    this.res = (d: NodeProps) => d;
    this.reject = () => {
      return;
    };
    this.searchInput.disabled = true;
  }

  show({ x = this.x, y = this.y, socket }: ContextOptions): Promise<NodeProps> {
    this.x = x;
    this.y = y;
    this.socket = socket;
    this.visible = true;

    this.wrapper.style.left = x + 'px';
    this.wrapper.style.top = y + 'px';
    setTimeout(() => {
      this.searchInput.disabled = false;
      this.wrapper.classList.add('context-visible');
      this.searchInput.value = '';
      this.searchInput.focus();
      this.search();
    }, 10);

    // Hide all containers
    this.containers.forEach((c) => c.hide());
    // get all possible containers
    this.possibleContainers = !socket
      ? this.containers
      : this.containers.filter((c) => {
          if (socket instanceof NodeInput) {
            const { type } = socket;
            if (!c.type.outputs || !c.type.outputs.length) return false;
            if (type.includes('*')) return true;
            return c.type.outputs?.some((t) => type.includes(t));
          } else {
            const { type } = socket;
            if (!c.type.inputs || !c.type.inputs.length) return false;
            if (type === '*') return true;
            return (
              c.type.inputs?.includes('*') || c.type.inputs?.includes(type)
            );
          }
        });

    // show them
    this.possibleContainers.forEach((c) => c.show());

    if (this.possibleContainers.length) this.possibleContainers[0].focus();

    this.filteredContainers = [...this.possibleContainers];

    return new Promise((res, rej) => {
      this.res = res;
      this.rej = rej;
    });
  }
}
