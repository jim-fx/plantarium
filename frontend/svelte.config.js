import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

import path from 'path';
import glslify from 'vite-plugin-glslify';
import { visualizer } from 'rollup-plugin-visualizer';
import comlink from 'vite-plugin-comlink'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    prerender: { default: true },
    vite: {
      clearScreen: true,
      logLevel: 'silent',
      server: {
        host: '0.0.0.0',
        port: 8080
      },
      optimizeDeps: {
        include: ['ogl', "open-simplex-noise", "file-saver"]
      },
      plugins: [
        // tsconfigPaths(),
        glslify.default(),
        visualizer({
          filename: 'build/stats.html',
          projectRoot: path.resolve('./')
        }),
        comlink.default(),
      ],
      worker: {
        plugins: [comlink.default()]
      }
    }
  }
};

export default config;
