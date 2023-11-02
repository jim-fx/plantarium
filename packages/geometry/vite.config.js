import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
export default {
	server: { host: '0.0.0.0', port: 8082 },
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['@plantarium/ui', '@plantarium/helpers', '@plantarium/types']
	}
};
