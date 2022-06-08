import { logger } from '@plantarium/helpers/src';
import type { HistoryData, NodeProps } from '../types';
import { DiffPatcher } from "jsondiffpatch/dist/jsondiffpatch.umd.js"
import type NodeSystem from './NodeSystem';

const log = logger('NodeHistory');

export default class NodeHistory {
  history: { previous: Partial<NodeProps>; next: Partial<NodeProps> }[] = [];
  historyIndex = -1;

  isApplyingChanges = false;

  prevState: NodeProps[];

  patcher = new DiffPatcher({ nested: true });

  private _timeout: ReturnType<typeof setTimeout>

  constructor(private system: NodeSystem) {
    log(`Initialized`);
  }

  addAction() {

    if (!this.system.isLoaded) return;
    if (this.isApplyingChanges) return;

    if (this._timeout) {
      clearTimeout(this._timeout);
    } else {
      this.prevState = this.system.serialize().nodes;
    }

    this._timeout = setTimeout(() => {
      this._addAction();
      this._timeout = undefined;
    }, 200);
  }

  private _addAction() {
    log('Register History Step');

    if (this.isApplyingChanges) return;

    // Check if we are in detached head mode and remove all other steps
    if (this.historyIndex !== this.history.length - 1) {
      this.history.length = this.historyIndex + 1;
    }

    const newState = this.system.serialize().nodes;
    const delta = this.patcher.diff(this.prevState, newState);

    this.history.push(delta);

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
      log('Reached beginning of Stack');
      this.isApplyingChanges = false;
      return;
    }

    const delta = this.history[this.historyIndex];

    const d = this.system.serialize();

    const data = this.patcher.patch(d.nodes, this.patcher.reverse(delta));

    d.nodes = data;

    this.system.load(d);

    this.historyIndex--;
    this.isApplyingChanges = false;
  }

  redo() {
    if (this.isApplyingChanges) return;
    this.isApplyingChanges = true;

    if (this.historyIndex >= this.history.length - 1) {
      log('Reached end of Stack');
      this.isApplyingChanges = false;
      return;
    }

    const delta = this.history[this.historyIndex + 1];

    const d = this.system.serialize();

    console.log({ d, delta })

    try {

      const data = this.patcher.patch(d.nodes, delta);
      d.nodes = data;


      this.system.load(d);

      this.historyIndex++;
      this.isApplyingChanges = false;
    } catch (err) {
      console.log(err)
    }
  }
}
