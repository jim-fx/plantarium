import { debounce } from '@plantarium/helpers';

let savedState;

try {
  savedState = JSON.parse(localStorage.getItem('pt_local_state'));
} catch (error) {}

const state = { ...savedState };

const set: (...args: any[]) => void = debounce(
  (key: string, value: any) => {
    state[key] = value;
    localStorage.setItem('pt_local_state', JSON.stringify(state));
  },
  100,
  false,
);

export default {
  get(key: string) {
    return state[key];
  },
  set,
};
