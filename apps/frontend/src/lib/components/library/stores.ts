import type { Project } from '@plantarium/types';
import { writable } from 'svelte/store';

export const state = writable<'local' | 'remote'>('local');

export const activeProject = writable<Project | null>();
export const isLoading = writable(false);

export const newIDS = writable<string[]>([]);

export const transitionImage = writable<HTMLImageElement>();
