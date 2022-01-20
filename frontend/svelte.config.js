import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

import path from 'path';
import glslify from 'rollup-plugin-glslify';
import svg from 'rollup-plugin-svg-import';
import { visualizer } from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-tsconfig-paths';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		target: '#svelte',
		vite: {
			server: {
				host: '0.0.0.0',
				port: 8080
			},
			optimizeDeps: {
				include: ['ogl']
			},
			plugins: [
				tsconfigPaths(),
				glslify(),
				svg(),
				visualizer({
					filename: 'build/stats.html',
					projectRoot: path.resolve('./')
				})
			]
		}
	}
};

export default config;
