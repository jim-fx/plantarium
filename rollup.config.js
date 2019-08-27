import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import scss from "rollup-plugin-scss";
import { uglify } from "rollup-plugin-uglify";
import liveServer from "rollup-plugin-live-server";

const PROD = process.env.NODE_ENV === "production";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "./src/index.ts",

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    babel({
      extensions: extensions
    }),

    // will output compiled styles to bundle.css
    scss(),

    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      sourceMap: !PROD
    }),

    PROD && uglify(),

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
};
