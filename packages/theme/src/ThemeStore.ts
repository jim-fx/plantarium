import { derived, writable } from 'svelte/store';
import { themes, themeNames } from './Themes';

let activeTheme = 'dark';

if ('localStorage' in globalThis) {
  activeTheme =
    'theme' in localStorage ? localStorage.getItem('theme') : themeNames[0];
}
if (!themeNames.includes(activeTheme)) activeTheme = themeNames[0];
if (globalThis["window"]) {
  document.body.classList.add("theme-" + activeTheme);
}

export const store = writable(themes[activeTheme]);

export const currentTheme = writable(activeTheme);

export const setTheme = (style: string) => {
  if (themeNames.includes(style)) {
    for (const s of document.body.classList.values()) {
      if (s.startsWith("theme-")) {
        document.body.classList.remove(s)
      }
    }
    document.body.classList.add("theme-" + style);

    store.set(themes[style]);
    currentTheme.set(style);
    localStorage.setItem('theme', style);
  } else {
    console.warn("cannot set theme", style)
  }
};

export default store;
