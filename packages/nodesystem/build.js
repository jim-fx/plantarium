const { sassPlugin } = require('@es-pack/esbuild-sass-plugin');
const { build, serve } = require('esbuild');
const sveltePlugin = require('esbuild-svelte');
const sveltePreprocess = require('svelte-preprocess');

const options = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format: 'esm',
  loader: {
    '.svg': 'text',
  },
  outfile: './public/dist/index.esm.js',
  sourcemap: true,
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compileOptions: { customElement: true },
    }),
    sassPlugin(),
  ],
};

const devOptions = {
  ...options,
};

if (process.argv[2] === '--dev') {
  serve({ port: 8085, servedir: 'public' }, options);
} else {
  build(options).catch((err) => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });
}
