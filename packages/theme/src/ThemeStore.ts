import { derived, writable } from 'svelte/store';
import { themes, themeNames } from './Themes';

let activeTheme = 'dark';

if ('localStorage' in globalThis) {
  activeTheme =
    'theme' in localStorage ? localStorage.getItem('theme') : themeNames[0];
}
if (!themeNames.includes(activeTheme)) activeTheme = themeNames[0];

export const store = writable(themes[activeTheme]);

export const currentTheme = writable(activeTheme);

export const setTheme = (style: string) => {
  if (themeNames.includes(style)) {
    store.set(themes[style]);
    currentTheme.set(style);
    localStorage.setItem('theme', style);
  } else {
    console.log("cannot set theme", style)
  }
};

export default store;
