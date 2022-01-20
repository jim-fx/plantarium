import { writable } from 'svelte/store';
import type TutorStep from './ITutorStep';

export default writable<TutorStep>(undefined);
