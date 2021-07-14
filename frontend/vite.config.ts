import { svelte } from '@sveltejs/vite-plugin-svelte';
import glslify from 'rollup-plugin-glslify';
import svg from 'rollup-plugin-svg-import';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), glslify(), svelte(), svg()],
  build: {
    minify: 'esbuild',
    brotliSize: false,
  },
  optimizeDeps: {
    include: ['@plantarium/ui'],
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
