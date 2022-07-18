import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import glslify from 'vite-plugin-glslify';

export default {
  clearScreen: true,
  ssr: { noExternal: ['ogl-typescript', "@plantarium/*"] },
  logLevel: 'silent',
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  optimizeDeps: {
    include: ["open-simplex-noise", "file-saver"]
  },
  plugins: [
    sveltekit(),
    glslify.default(),
    visualizer({
      filename: 'build/stats.html',
      projectRoot: path.resolve('./')
    }),
  ],
}

