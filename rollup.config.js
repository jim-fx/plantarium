//BROWSER
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import scss from "rollup-plugin-scss";
import json from "rollup-plugin-json";
import liveServer from "rollup-plugin-live-server";
import glslify from "rollup-plugin-glslify";
import { terser } from "rollup-plugin-terser";
import analyze from "rollup-plugin-analyzer";
import svg from "rollup-plugin-svg";
import visualizer from "rollup-plugin-visualizer";

const PROD = process.env.ROLLUP_WATCH !== "true";

//NODEJS
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import typescript from 'rollup-plugin-typescript';

const extensions = [ '.mjs','.js', '.json', '.node', ".ts"];

export default [
  {
    input: "./src/index.ts",

    watch: { clearScreen: false },

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

      svg(),

      PROD && terser(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        }),

      PROD &&
        visualizer({
          sourcemap: true
        }),

      //Import GLSL Shaders
      glslify({ include: ["**/*.vert", "**/*.frag"] }),

      PROD &&
        liveServer({
          root: "./build/client",
          open: false,
          logLevel: 0
        })
    ],

    output: [
      {
        file: "./build/client/bundle.js",
        format: "iife",
        name: "plantarium_client",
        sourcemap: true
      }
    ]
  },
  {
    input: "./src/components/model-generator",

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
        file: "./build/client/sw.js",
        format: "iife",
        name: "plantarium_serviceworker",
        sourcemap: true
      }
    ]
  },
  {
    input: "./server/server.ts",

    plugins: [

      json(),

      // Allows node_modules resolution
      resolve({ 
        preferBuiltins: true,
        extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      typescript({
        moduleResolution: "node"
      }),

      globals(),

      builtins(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        }),

      PROD && terser()

      //!PROD && run()
    ],

    output: [
      {
        file: "./build/server/server.js",
        format: "cjs",
        name: "plantarium_server"
      }
    ]
  }
];
