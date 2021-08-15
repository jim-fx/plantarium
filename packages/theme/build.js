/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const sassPlugin = require('esbuild-plugin-sass');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    plugins: [sassPlugin()],
  })
  .catch((e) => console.error(e.message));
