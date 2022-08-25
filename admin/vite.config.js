import { sveltekit } from '@sveltejs/kit/vite';
import WindiCSS from 'vite-plugin-windicss';

export default {
  legacy: { buildSsrCjsExternalHeuristics: true },
  ssr: {
    noExternal: ['ogl-typescript', '@plantarium/helpers'],
  },
  plugins: [WindiCSS(), sveltekit()],
};
