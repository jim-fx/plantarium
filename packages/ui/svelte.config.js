/* eslint-disable */
const preprocess = require('svelte-preprocess');
const { typescript } = require('svelte-preprocess-esbuild');
const production = !process.env.ROLLUP_WATCH;

module.exports = {
  preprocess: [
    typescript(),
    preprocess({
      typescript: false,
    }),
  ],
  compilerOptions: {
    customElement: true,
    dev: !production,
  },
};
