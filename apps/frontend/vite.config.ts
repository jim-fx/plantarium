import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [sveltekit(), glsl()],
	server: {
		port: 8080,
		host: '0.0.0.0'
	}
});
