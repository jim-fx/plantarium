import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import WindiCSS from 'vite-plugin-windicss';

let { BASE_PATH = '', IS_GH_PAGES = false } = process.env;
if (IS_GH_PAGES) {
  BASE_PATH = '/admin';
}
/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    // hydrate the <div id="svelte"> element in src/app.html
    // target: '#svelte',

    paths: {
      base: BASE_PATH,
    },

    vite: {
      ssr: {
        noExternal: ['ogl-typescript'],
      },
      plugins: [WindiCSS()],
    },
  },
};

export default config;
