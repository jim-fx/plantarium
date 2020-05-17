import NodeView from 'view/NodeView';
import Node from 'model/Node';
import SettingsUI from 'settings-ui';
import 'settings-ui/dist/index.css';

function getType(value: any) {
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function stateToTemplate(state: any, nodeState: any): any[] {
  if (Array.isArray(state) && Array.isArray(nodeState)) {
    return state.map((s, i) => Object.assign(s, nodeState[i]));
  } else {
    const keys = Object.keys(state);
    return keys.map((k) => {
      const key = k;
      const value = state[key];
      const type = getType(value);

      if (type === 'array') {
        return {
          id: key,
          name: '',
          type: 'string',
          inputType: 'selection',
          defaultValue: key in nodeState ? nodeState[key] : value[0],
          values: value,
        };
      } else {
        return {
          id: key,
          type,
          defaultValue: key in nodeState ? nodeState[key] : value,
        };
      }
    });
  }
}

export default function (node: Node, view: NodeView, state: NodeState = {}) {
  const store = {};

  const template = stateToTemplate(state, node.state);

  const ui = SettingsUI();

  ui.bind(template, store);

  ui.addChangeListener(() => node.setState(store));

  ui.render().to(view.wrapper);
}
