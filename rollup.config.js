import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import scss from "rollup-plugin-scss";
import json from "rollup-plugin-json";
import liveServer from "rollup-plugin-live-server";
import glslify from "rollup-plugin-glslify";
import { terser } from "rollup-plugin-terser";
import analyze from "rollup-plugin-analyzer";
import svg from 'rollup-plugin-svg'

import visualizer from "rollup-plugin-visualizer";

const PROD = process.env.NODE_ENV === "production";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "./src/index.ts",

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
        file: "./build/generator.js",
        format: "iife",
        name: "plantarium",
        sourcemap: true
      }
    ]
  }
];
