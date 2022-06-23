import { writable } from 'svelte/store';
import { themeNames, themes } from './Themes';

let activeTheme = 'dark';

if ('localStorage' in globalThis) {
  activeTheme =
    'theme' in localStorage ? localStorage.getItem('theme') : themeNames[0];
}
if (!themeNames.includes(activeTheme)) activeTheme = themeNames[0];
if (globalThis["window"]) {
  document.body.classList.add("theme-" + activeTheme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTheme(activeTheme)
  });
}

export const store = writable(themes[activeTheme]);

export const currentTheme = writable(activeTheme);

function removeThemeClasses() {
  for (const s of document.body.classList.values()) {
    if (s.startsWith("theme-")) {
      document.body.classList.remove(s)
    }
  }

}

export const setTheme = (style = activeTheme) => {
  if (style === activeTheme && style !== "auto") return;

  activeTheme = style;
  currentTheme.set(style);

  if (style === "auto") {
    if (globalThis["window"] && window.matchMedia) {
      removeThemeClasses()
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log("dark")
        document.body.classList.add("theme-dark");
        store.set(themes["dark"])
      } else {
        console.log("light")
        store.set(themes["light"])
        document.body.classList.add("theme-light");
      }
    }
  } else if (themeNames.includes(style)) {
    removeThemeClasses()
    document.body.classList.add("theme-" + style);

    store.set(themes[style]);
    localStorage.setItem('theme', style);
  } else {
    console.warn("cannot set theme", style)
  }
};

export default store;
