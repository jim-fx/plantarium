import adapter from '@sveltejs/adapter-static';
import path from 'path';
import preprocess from 'svelte-preprocess';

let { BASE_PATH = '', IS_GH_PAGES = false } = process.env;
if (IS_GH_PAGES) {
  BASE_PATH = '/ui';
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    paths: { base: BASE_PATH },

    vite: {
      server: { host: '0.0.0.0', port: 8085 },
      optimizeDeps: { include: ['highlight.js/lib/core'] },
      ssr: { noExternal: ['ogl'] },
      resolve: { alias: { '@plantarium/ui': path.resolve('src/lib') } }
    }
  }
};

export default config;
