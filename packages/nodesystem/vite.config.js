import { sveltekit } from '@sveltejs/kit/vite';

export default {
  optimizeDeps: { include: ["jsondiffpatch"] },
  server: { host: '0.0.0.0', port: 8085 },
  plugins: [sveltekit()],
  ssr: { noExternal: ['ogl-typescript', "@plantarium/ui"] },
}