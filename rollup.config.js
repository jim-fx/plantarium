import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import scss from "rollup-plugin-scss";
import liveServer from "rollup-plugin-live-server";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "./src/index.ts",

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    // Compile TypeScript/JavaScript files
    babel({ extensions, include: ["src/**/*"] }),

    // will output compiled styles to bundle.css
    scss(),

    liveServer({
      root: "./dist",
      open: true,
      logLevel: 0
    })
  ],

  output: [
    {
      file: "dist/bundle.js",
      format: "iife",
      name: "plantGenerator",
      sourcemap: "inline",

      // https://rollupjs.org/guide/en#output-globals-g-globals
      globals: {}
    }
  ]
};
