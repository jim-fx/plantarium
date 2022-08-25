import store from './store';

const importLine = `import * as g from "geometry";`;
let code = importLine + '\n';

if (store.get('code')) {
	code = store.get('code');
} else if (globalThis['window'] && window.location.hash.length > 5) {
	try {
		const decoded = window.atob(window.location.hash.replace(/^#/, ''));
		const escaped = window.escape(decoded);
		code = decodeURIComponent(escaped);
	} catch (err) {
		console.log(err.message);
	}
}
const cbs = [];
export function onValueChange(cb) {
	cbs.push(cb);
}
