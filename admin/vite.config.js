import { sveltekit } from '@sveltejs/kit/vite';
import WindiCSS from 'vite-plugin-windicss';

export default {
  ssr: {
    noExternal: ['ogl-typescript'],
  },
  plugins: [WindiCSS(), sveltekit()],
}
