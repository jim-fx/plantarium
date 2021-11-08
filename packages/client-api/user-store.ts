import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface User {
	username: string;
	id: string;
}

const user: Writable<User | undefined> = writable();

export const userStore = user;
