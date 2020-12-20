import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import sass from "sass";
import glslify from "rollup-plugin-glslify";
import svg from "rollup-plugin-svg-import";
import analyze from 'rollup-plugin-analyzer'

import iife from "rollup-plugin-iife";
import OMT from "@surma/rollup-plugin-off-main-thread";


// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;

let i = 0;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: "esm",
		dir: "public/build"
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				dev: !production,
			}
		}),
		scss({
			sass,
			output: "public/build/bundle.css"
		}),

		glslify(),

		svg({
			stringify: true
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
			moduleDirectory: [ // as array
				'../packages/*',
			]
		}),
		commonjs(),
		typescript({
			inlineSources: !production,
			include: ["../packages/**/*.ts", "src/**/*.ts"]
		}),

		!production && livereload('public'),

		production && terser(),

		// iife(),
		OMT(),

		analyze({
			hideDeps: false,
			filterSummary: false,
			filter: () => i++ < 5
		}),

	],
	watch: {
		clearScreen: false
	}
};
