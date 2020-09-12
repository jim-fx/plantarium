/* eslint-disable no-undef */
//BROWSER
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import liveServer from 'rollup-plugin-live-server';
import glslify from 'rollup-plugin-glslify';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import svg from 'rollup-plugin-svg';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import sourcemaps from "rollup-plugin-sourcemaps";

const PROD = process.env.ROLLUP_WATCH !== 'true';


export default {
  input: './src/index.ts',

  watch: { clearScreen: false },

  plugins: [
    // Allows node_modules resolution
    resolve(),

    //For importing defaultPlantDescription
    json(),

    typescript(),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      sourceMap: !PROD,
    }),

    sourcemaps(),

    svg(),

    // will output compiled styles to bundle.css
    scss({
      sourceMapEmbed: true
    }),

    replace({
      SERVER_URL: process.env.SERVER_URL,
    }),

    PROD && terser(),

    PROD &&
    analyze({
      summaryOnly: true,
      limit: 10,
    }),

    PROD &&
    visualizer({
      sourcemap: true,
    }),

    //Import GLSL Shaders
    glslify({ include: ['**/*.vert', '**/*.frag'] }),

    !PROD &&
    liveServer({
      root: './public',
      open: true,
      quiet: true,
      logLevel: 0,
    }),
  ],

  output: [
    {
      file: './public/dist/bundle.js',
      format: 'iife',
      name: 'plantarium_client',
      sourcemap: true,
    },
  ],
};
