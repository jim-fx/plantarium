
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import sourcemaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
import { getPackages } from '@lerna/project';
import batchPackages from '@lerna/batch-packages';
import includePaths from 'rollup-plugin-includepaths';
import autoPreprocess from 'svelte-preprocess';
import svelte from "rollup-plugin-svelte";
import typescript from '@rollup/plugin-typescript';
// import babel from '@rollup/plugin-babel';
import minimist from "minimist";
import commonjs from '@rollup/plugin-commonjs';

import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';

const PROD = process.env.ROLLUP_WATCH !== 'true';


async function getSortedPackages() {
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = await getPackages(__dirname);
  // last boolean argument automatically filters out private packages
  // you probably don't want a two-dimensional array, so flatten it
  return batchPackages(packages).reduce((arr, batch) => arr.concat(batch), []);
}

async function main() {

  // Support --scope and --ignore globs if passed in via commandline
  // const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = await getSortedPackages();

  return packages
    .filter(pkg => {
      return !pkg.name.includes("types") /* && !pkg.name.includes("frontend") */;
    })
    .map(pkg => {

      /* Absolute path to package directory */
      const basePath = path.relative(__dirname, pkg.location);

      /* Absolute path to input file */
      const input = path.join(basePath, 'src/index.ts');

      const isFrontend = pkg.name.includes("frontend");

      const external = isFrontend ? [] : Object.keys(pkg.dependencies || []);

      /* "main" field from package.json file. */
      const { main, module, name } = pkg.toJSON();

      const outFile = path.join(basePath, main);
      const outDir = path.dirname(outFile);

      const outputs = [];

      if (main) {
        outputs.push({
          name,
          dir: outDir,
          format: 'esm',
          sourcemap: true
        })
      }

      if (module) {
        // outputs.push({
        //   name,
        //   dir: outDir,
        //   format: 'cjs',
        //   sourcemap: true
        // })
      }

      /* Push build config for this package. */
      return {
        input,
        external,
        watch: {
          clearScreen: false
        },
        output: outputs,
        plugins: [

          resolve({
            browser: true,
            preferBuiltins: false
          }),

          commonjs(),

          typescript({
            tsconfig: basePath + "/tsconfig.json"
          }),

          includePaths({ paths: ["./src"] }),

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
            output: outDir + '/bundle.css',
            sourceMapEmbed: true
          }),

          sourcemaps(),


          PROD && terser(),

        ]
      };
    })
}

export default main();