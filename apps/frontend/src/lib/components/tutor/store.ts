import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';

export interface TutorState {
	description: string | typeof SvelteComponent;
	title?: string;
	selector?: string;
	clickSelector?: string;
	values?: string[];
	resolve: (state?: string) => void;
}

const store = writable<TutorState | undefined>(undefined);
type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const createOverlay = async (state: PartiallyOptional<TutorState, 'resolve'>) => {
	let _r: (value?: unknown) => void;
	store.set({
		...state,
		resolve: (s?: string) => {
			console.log('resolve', s);
			_r(s);
			store.set(undefined);
		}
	});
	return new Promise((_res) => (_r = _res));
};

export default store;
