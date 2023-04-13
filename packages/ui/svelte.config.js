import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

let { BASE_PATH = '' } = process.env;

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    paths: { base: BASE_PATH },
  }
};
