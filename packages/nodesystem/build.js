/* eslint-disable @typescript-eslint/no-var-requires */
const { sassPlugin } = require('@es-pack/esbuild-sass-plugin');
const { build, serve } = require('esbuild');
const sveltePlugin = require('esbuild-svelte');
const sveltePreprocess = require('svelte-preprocess');
const { typescript } = require('svelte-preprocess-esbuild');
const options = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format: 'esm',
  logLevel: 'info',
  loader: {
    '.svg': 'text',
  },
  outfile: './public/dist/index.esm.js',
  sourcemap: true,
  plugins: [
    sveltePlugin({
      preprocess: [typescript(), sveltePreprocess({ typescript: false })],
    }),
    sassPlugin(),
  ],
};

const devOptions = {
  ...options,
};

const port = 8084;

if (process.argv[2] === '--dev') {
  serve({ port, servedir: 'public' }, options).then((result) => {
    // Call "stop" on the result when you're done
  });
  console.log('Serving on port', port);
} else {
  build(options).catch((err) => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });
}
