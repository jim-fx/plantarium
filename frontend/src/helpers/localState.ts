import { debounce } from '@plantarium/helpers';

let savedState;

try {
  savedState = JSON.parse(localStorage.getItem('pt_local_state') as string);
} catch (error) {
  console.log(error);
}

const state = { ...savedState };

const set: (...args: unknown[]) => void = debounce(
  (key: string, value: unknown) => {
    state[key] = value;
    localStorage.setItem('pt_local_state', JSON.stringify(state));
  },
  100,
  false,
);

export default {
  get(key: string): unknown {
    return state[key];
  },
  set,
};
