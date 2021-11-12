const preprocess = require('svelte-preprocess');
const { typescript } = require('svelte-preprocess-esbuild');

module.exports = {
  preprocess: [
    typescript(),
    preprocess({
      typescript: false,
    }),
  ],
};
