const preprocess = require('svelte-preprocess');
const { typescript } = require('svelte-preprocess-esbuild');

const {ADMIN_PATH = "/"} = process.env;

module.exports = {
  preprocess: [
    typescript(),
    preprocess({
      typescript: false,
    }),
  ],
  kit: {
    paths: {
			base: ADMIN_PATH,
		},
  }
};
