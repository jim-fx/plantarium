import { sveltekit } from '@sveltejs/kit/vite';

export default {
  server: { host: '0.0.0.0', port: 8085 },
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['ogl', '@plantarium/ui', '@plantarium/helpers'],
  },
};
