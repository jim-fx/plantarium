import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

let { BASE_PATH = '', IS_GH_PAGES = false } = process.env;
if (IS_GH_PAGES) {
  BASE_PATH = '/nodes';
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    paths: { base: BASE_PATH },

    prerender: { default: true, enabled: true },



    vite: {
      optimizeDeps: { include: ["jsondiffpatch"] },
      server: { host: '0.0.0.0', port: 8085 },
      ssr: { noExternal: ['ogl-typescript', "@plantarium/ui"] },
    }
  }
};

export default config;
