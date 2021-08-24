import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  optimizeDeps: {
    include: ['./src/mikro-orm.config.ts'],
    exclude: [
      '@mikro-orm/mariadb',
      '@mikro-orm/mysql',
      '@mikro-orm/postgresql',
      'mongodb-client-encryption',
    ],
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      tsCompiler: 'swc',
    }),
  ],
});
