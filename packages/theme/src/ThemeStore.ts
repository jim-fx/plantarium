import { writable } from 'svelte/store';
import { themes, themeNames } from './Themes';

let activeTheme =
  'theme' in localStorage ? localStorage.getItem('theme') : themeNames[0];
if (!themeNames.includes(activeTheme)) activeTheme = themeNames[0];

export const store = writable(themes[activeTheme]);

store.subscribe((s) => {
  console.log('Eyyy');
});

export const setTheme = (style: string) => {
  console.log('Eyyyy');
  if (themeNames.includes(style)) {
    store.set(themes[style]);
    localStorage.setItem('theme', style);
  }
};

export default store;
