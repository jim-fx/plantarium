import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import scss from "rollup-plugin-scss";
import json from "rollup-plugin-json";
import liveServer from "rollup-plugin-live-server";
import glslify from "rollup-plugin-glslify";
import { terser } from "rollup-plugin-terser";
import analyze from "rollup-plugin-analyzer";

const PROD = process.env.NODE_ENV === "production";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "./src/index.ts",

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
      babel({
        extensions: extensions
      }),

      //For importing defaultPlantDescription
      json(),

      // will output compiled styles to bundle.css
      scss(),

      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      PROD && terser(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        }),

      //Import GLSL Shaders
      glslify({ include: ["**/*.vert", "**/*.frag"] }),

      !PROD &&
        liveServer({
          root: "./build",
          open: true,
          logLevel: 0
        })
    ],

    output: [
      {
        file: "./build/bundle.js",
        format: "iife",
        name: "plantGenerator",
        sourcemap: PROD ? false : "inline",

        // https://rollupjs.org/guide/en#output-globals-g-globals
        globals: {}
      }
    ]
  },
  {
    input: "./src/components/model-generator",

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
      babel({
        extensions: extensions
      }),

      json(),

      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        }),

      PROD && terser()
    ],

    output: [
      {
        file: "./build/generator.js",
        format: "iife",
        name: "plantGenerator",
        sourcemap: PROD ? false : "inline",

        // https://rollupjs.org/guide/en#output-globals-g-globals
        globals: {}
      }
    ]
  }
];
