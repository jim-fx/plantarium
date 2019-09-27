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
import run from "rollup-plugin-run";
import typescript from "rollup-plugin-typescript";
import graphql from "rollup-plugin-graphql";
import dotenv from "dotenv";
dotenv.config();

const PROD = process.env.ROLLUP_WATCH !== "true";
const extensions = [".mjs", ".ts", ".js"];
const externals = ["child_process", "http", "path", "events", "zlib", "buffer", "stream", "util", "tty", "fs", "net", "string_decoder", "crypto", "module", "url", "assert", "constants"];

const server = {
  input: "./server/index.ts",
  plugins: [
    typescript(),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      sourceMap: !PROD
    }),

    // Allows node_modules resolution
    resolve({ extensions, preferBuiltins: true }),

    graphql(),

    json(),

    PROD && terser(),

    PROD &&
      analyze({
        summaryOnly: true,
        limit: 10
      }),

    run({
      execArgv: ["-r", "source-map-support/register"]
    })
  ],
  external: externals,
  output: {
    file: "build/server/server.js",
    format: "cjs",
    name: "plantarium_server",
    sourcemap: true
  }
};

const client = {
  input: "./src/index.ts",

  watch: { clearScreen: false },

  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      sourceMap: !PROD
    }),

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
        root: "./build/client",
        open: true,
        quiet: true,
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
};

const clientModel = {
  input: "./src/components/model-generator/worker.ts",

  plugins: [
    // Allows node_modules resolution
    resolve({ mainFields: ["module"], extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      sourceMap: !PROD
    }),

    babel({
      extensions: extensions
    }),

    replace({
      SERVER_URL: process.env.SERVER_URL
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
      file: "./build/client/generator.js",
      format: "iife",
      name: "plantarium_generator",
      sourcemap: true
    }
  ]
};

const clientData = {
  input: "./src/components/data-service/worker.ts",

  plugins: [
    babel({
      extensions: extensions
    }),

    json(),

    // Allows node_modules resolution
    resolve({ extensions }),

    replace({
      SERVER_URL: process.env.SERVER_URL
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
      file: "./build/client/dataService.js",
      format: "iife",
      name: "plantarium_dataservice",
      sourcemap: true
    }
  ]
};

const clientServiceWorker = {
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
      file: "./build/client/sw.js",
      format: "iife",
      name: "plantarium_serviceworker",
      sourcemap: true
    }
  ]
};

export default [server, client, clientModel, clientData, clientServiceWorker];
