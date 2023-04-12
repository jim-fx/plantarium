import { sveltekit } from '@sveltejs/kit/vite';
import glsl from "vite-plugin-glsl";

/** @type {import('vite').UserConfig} */
export default {
  clearScreen: true,
  ssr: { noExternal: ['ogl-typescript', '@plantarium/ui', '@plantarium/helpers'] },
  logLevel: 'silent',
  build: {
    sourcemap: true
  },
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  plugins: [
    sveltekit(),
    glsl()
  ]
};
