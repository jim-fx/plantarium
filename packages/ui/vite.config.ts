import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    svelte({ compilerOptions: { customElement: true } }),
  ],
  base: '',
  build: {
    minify: 'esbuild',
    brotliSize: false,
  },
  server: {
    host: '0.0.0.0',
    port: 8084,
  },
});
