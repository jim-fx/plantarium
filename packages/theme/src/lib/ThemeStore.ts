import { writable } from 'svelte/store';

export const themeNames = ['auto', 'light', 'dark'] as const;
type ThemeName = (typeof themeNames)[number];

let activeTheme: ThemeName = themeNames[0];

if ('localStorage' in globalThis) {
	activeTheme = (localStorage.getItem('theme') as ThemeName) || themeNames[0];
}
if (!themeNames.includes(activeTheme)) activeTheme = themeNames[0];
if (globalThis['window']) {
	document.body.classList.add('theme-' + activeTheme);
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		setTheme(activeTheme);
	});
}

export const currentTheme = writable<(typeof themeNames)[number]>(activeTheme);

function removeThemeClasses() {
	for (const s of document.body.classList.values()) {
		if (s.startsWith('theme-')) {
			document.body.classList.remove(s);
		}
	}
}

export const setTheme = (style = activeTheme) => {
	if (style === activeTheme && style !== 'auto') return;

	activeTheme = style;
	currentTheme.set(style);

	if (style === 'auto') {
		if (globalThis['window'] && window.matchMedia) {
			removeThemeClasses();
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.body.classList.add('theme-dark');
			} else {
				document.body.classList.add('theme-light');
			}
		}
	} else if (themeNames.includes(style)) {
		removeThemeClasses();
		document.body.classList.add('theme-' + style);

		localStorage.setItem('theme', style);
	} else {
		console.warn('cannot set theme', style);
	}
};

export const ThemeStore = currentTheme;
