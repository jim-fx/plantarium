import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
	clearScreen: false,
	plugins: [
		...VitePluginNode({
			adapter: 'nest',
			appPath: './src/main.ts',
			tsCompiler: 'swc',
		}),
	],
	optimizeDeps: {
		exclude: [
			'@mikro-orm/postgresql',
			'@mikro-orm/core',
			'mongodb-client-encryption',
			'@mikro-orm/mariadb',
		],
	},
});
