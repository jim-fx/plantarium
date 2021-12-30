import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import path from "path";

const { BASE_PATH = '' } = process.env;


/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),


  kit: {
    adapter: adapter(),

    paths:{
      base: BASE_PATH
    },

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      server: {
        host: "0.0.0.0",
        port: 8085
      },
      optimizeDeps: {
        include: ["highlight.js/lib/core"],
      },
      ssr: {
        noExternal: ["ogl"]
      },
      resolve: {
        alias: {
          "@plantarium/ui": path.resolve("src/lib")
        }
      }
    }
  }
};

export default config;
