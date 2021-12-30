import { diffBoth, mergeObjects } from '../helpers';
import Logger from './Logger';
import type NodeSystem from './NodeSystem';

export default class NodeHistory {
  history: { previous: Partial<NodeProps>; next: Partial<NodeProps> }[] = [];
  historyIndex = -1;

  isApplyingChanges = false;

  log: Logger;

  addAction: NodeHistory['_addAction'];
  prevState: NodeProps[];

  constructor(private system: NodeSystem) {
    this.log = new Logger(this);
    this.log.info(`Instantiated`);

    this.addAction = (() => {
      let int;
      const f = () => {
        if (!this.system.isLoaded) return;
        if (this.isApplyingChanges) return;

        if (int) {
          clearTimeout(int);
        } else {
          this.prevState = this.system.serialize().nodes;
        }

        int = setTimeout(() => {
          this._addAction();
          int = false;
        }, 200);
      };

      return f;
    })().bind(this);
  }

  private _addAction() {
    this.log.info('Register History Step');

    if (this.isApplyingChanges) return;

    // Check if we are in detached head mode and remove all other steps
    if (this.historyIndex !== this.history.length - 1) {
      this.history.length = this.historyIndex + 1;
    }

    const newState = this.system.serialize().nodes;
    const [next, previous] = diffBoth(this.prevState, newState);

    if (!previous || !next) return;
    this.history.push({
      previous,
      next,
    });

    if (this.history.length > 60) {
      this.history = this.history.reverse().slice(0, 60).reverse();
    }

    this.historyIndex = this.history.length - 1;
  }

  serialize() {
    return {
      steps: this.history,
      index: this.historyIndex,
    };
  }

  deserialize(data: HistoryData) {
    this.historyIndex = data.index;
    this.history = data.steps;
  }

  undo() {
    if (this.isApplyingChanges) return;
    this.isApplyingChanges = true;
    if (this.historyIndex < 0) {
      this.log.info('Reached beginning of Stack');
      this.isApplyingChanges = false;
      return;
    }

    const { previous } = this.history[this.historyIndex];

    const d = this.system.serialize();

    const data = mergeObjects(d.nodes, previous);

    d.nodes = data;

    this.system.load(d);

    this.historyIndex--;
    this.isApplyingChanges = false;
  }

  redo() {
    if (this.isApplyingChanges) return;
    this.isApplyingChanges = true;

    if (this.historyIndex >= this.history.length - 1) {
      this.log.info('Reached end of Stack');
      this.isApplyingChanges = false;
      return;
    }

    const { next } = this.history[this.historyIndex + 1];

    const d = this.system.serialize();

    const data = mergeObjects(d.nodes, next);
    d.nodes = data;

    this.system.load(d);

    this.historyIndex++;
    this.isApplyingChanges = false;
  }
}