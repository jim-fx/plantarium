import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import sass from "sass";
import svg from "rollup-plugin-svg-import";
import serve from 'rollup-plugin-serve'

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    format: "iife",
    name: 'app',
    file: "public/build/bundle.js"
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    scss({
      sass,
      output: "public/build/bundle.css"
    }),

    svg({
      stringify: true
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
      moduleDirectory: [ // as array
        '../*',
      ]
    }),
    commonjs(),
    typescript({
      inlineSources: !production,
      include: ["../**/*.ts", "src/**/*.ts"]
    }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && serve('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

  ],
  watch: {
    clearScreen: false
  }
};
