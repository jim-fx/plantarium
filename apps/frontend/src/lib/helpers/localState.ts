import { browser } from '$app/environment';
import { debounce } from '@plantarium/helpers';

const savedState: { [key: string]: unknown } =
  browser && JSON.parse(localStorage.getItem('pt_local_state') as string);

const state = { ...savedState };

const set: (key: string, value: unknown) => void = debounce(
  (key: string, value: unknown) => {
    state[key] = value;
    browser && localStorage.setItem('pt_local_state', JSON.stringify(state));
  },
  100,
  false
);

export default {
  get<T>(key: string, defaultValue?: T): T {
    state[key] = state[key] ?? defaultValue;
    return state[key] as T;
  },
  set
};
