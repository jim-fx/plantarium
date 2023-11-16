import { writable } from 'svelte/store';

let _activeView = 'plant';

export const apiState = writable<"online" | "offline" | "loading">("online");

if ('window' in globalThis) {
  if (window.location.hash) {
    if (window.location.hash === '#library') {
      _activeView = 'library';
    }
  }
}

export const activeView = writable(_activeView);
activeView.subscribe((v) => {
  if ('window' in globalThis) {
    if (v === 'library') {
      window.location.hash = 'library';
    } else {
      window.location.hash = '';
    }
  }
});
