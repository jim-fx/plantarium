import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default {
  server: { host: '0.0.0.0', port: 8085 },
  optimizeDeps: { include: ['highlight.js', 'highlight.js/lib/core'] },
  ssr: { noExternal: ['ogl', '@plantarium/helpers'] },
  plugins: [sveltekit()],
  resolve: { alias: { '@plantarium/ui': resolve('src/lib') } }
};
