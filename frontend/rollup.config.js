/* eslint-disable no-undef */
//BROWSER
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
/* import analyze from 'rollup-plugin-analyzer';
import svg from 'rollup-plugin-svg';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace'; */
import typescript from '@rollup/plugin-typescript';
import sourcemaps from "rollup-plugin-sourcemaps";
import { string } from 'rollup-plugin-string';
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import livereload from "rollup-plugin-livereload"
import serve from "rollup-plugin-serve"

const PROD = process.env.ROLLUP_WATCH !== 'true';


export default {
  input: './src/index.ts',

  watch: { clearScreen: false },

  plugins: [

    resolve({
      browser: true,
      preferBuiltins: false
    }),

    commonjs(),

    typescript(),

    svelte({
      customElement: true,
      preprocess: autoPreprocess()
    }),

    string({
      include: [
        '**/*.frag',
        '**/*.vert',
      ],
    }),

    json(),


    scss({
      output: 'public/dist/bundle.css',
      sourceMapEmbed: true
    }),

    sourcemaps(),


    PROD && terser(),

    !PROD && livereload('public'),
    !PROD & serve({
      host: '0.0.0.0',
      port: 8080,
      contentBase: "public"
    }),

  ],

  output: [
    {
      dir: './public/dist',
      format: 'iife',
      name: 'plantarium_client',
      sourcemap: true,
    },
  ],
};
