import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import glslify from 'rollup-plugin-glslify';
import svg from 'rollup-plugin-svg-import';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    glslify(),
    svelte(),
    svg(),
    visualizer({
      filename: 'dist/stats.html',
      projectRoot: path.resolve('../'),
    }),
  ],
  base: '',
  build: {
    minify: 'esbuild',
    brotliSize: false,
		sourcemap:true
	},
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
	sourcemap:true
});
