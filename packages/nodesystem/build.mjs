/* eslint-disable @typescript-eslint/no-var-requires */
import { sassPlugin } from 'esbuild-sass-plugin';
import { build, serve } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { typescript } from 'svelte-preprocess-esbuild';
import { execSync } from 'child_process'

const tscPlugin =  {
  name: 'TypeScriptDeclarationsPlugin',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) return
      execSync('tsc')
    })
  }
}

const options = {
  entryPoints: ['./src/index.ts'],
  bundle: false,
  format: 'esm',
  logLevel: 'info',
  loader: {
    '.svg': 'text',
  },
  outfile: './public/dist/index.esm.mjs',
  sourcemap: true,
  plugins: [
    sveltePlugin({
      preprocess: [typescript(), sveltePreprocess({ typescript: false })],
    }),
    sassPlugin(),
    tscPlugin
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

  build({...options,...{format: "esm",bundle:true,outfile: './public/dist/index.js'}}).catch(err => {
    process.stderr.write(err.stderr);
    process.exit(1)
  })

}
