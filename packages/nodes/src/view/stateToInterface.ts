import Node from 'model/Node';
import SettingsUI from 'settings-ui';
import 'settings-ui/dist/index.css';
import NodeView from './NodeView';

function applyCurrentStateToStore(store, currentState) {
  Object.entries(currentState).forEach(([key, value = 0]) => {
    if (key in store) {
      store[key] = value === null ? 0 : value;
    }
  });

  return store;
}

export default function (node: Node, view: NodeView, stateTemplate: unknown) {
  const { state: currentState } = node;

  if (!stateTemplate || JSON.stringify(stateTemplate) === '{}') return;

  const template = Array.isArray(stateTemplate)
    ? stateTemplate
    : [stateTemplate];

  const ui = SettingsUI();

  const store = applyCurrentStateToStore(ui.bind(template), currentState);

  ui.addChangeListener(() => node.setState(store));

  ui.render().to(view.wrapper);

  ui.update();
}
