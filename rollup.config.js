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
import svg from "./src/assets/rollup-plugin-svg";
import visualizer from "rollup-plugin-visualizer";
import replace from "rollup-plugin-replace";
import dotenv from "dotenv";
dotenv.config();

const PROD = process.env.ROLLUP_WATCH !== "true";

const extensions = [".js", ".ts"];

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

      replace({
        SERVER_URL: process.env.SERVER_URL
      }),

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
        name: "plantarium_client",
        sourcemap: true
      }
    ]
  },
  {
    input: "./src/components/model-generator/worker.ts",

    plugins: [
      babel({
        extensions: extensions
      }),

      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      replace({
        SERVER_URL: env.SERVER_URL
      }),

      PROD && terser(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        })
    ],

    output: [
      {
        file: "./build/generator.js",
        format: "iife",
        name: "plantarium_generator",
        sourcemap: true
      }
    ]
  },
  {
    input: "./src/components/data-service/worker.ts",

    plugins: [
      babel({
        extensions: extensions
      }),

      json(),

      // Allows node_modules resolution
      resolve({ extensions }),

      replace({
        SERVER_URL: env.SERVER_URL
      }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      PROD && terser(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        })
    ],

    output: [
      {
        file: "./build/dataService.js",
        format: "iife",
        name: "plantarium_dataservice",
        sourcemap: true
      }
    ]
  },
  {
    input: "./src/sw.ts",

    plugins: [
      babel({
        extensions: extensions
      }),

      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        sourceMap: !PROD
      }),

      json(),

      PROD &&
        analyze({
          summaryOnly: true,
          limit: 10
        }),

      PROD && terser()
    ],

    output: [
      {
        file: "./build/sw.js",
        format: "iife",
        name: "plantarium_serviceworker",
        sourcemap: true
      }
    ]
  }
];
