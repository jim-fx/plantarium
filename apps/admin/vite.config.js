import { sveltekit } from '@sveltejs/kit/vite';
import WindiCSS from 'vite-plugin-windicss';

export default {
  ssr: {
    noExternal: ['ogl', '@plantarium/helpers'],
  },
  plugins: [sveltekit(), WindiCSS()],
};
