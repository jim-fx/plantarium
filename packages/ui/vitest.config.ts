/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: { all: true, include: ["src/lib/**/*.svelte", "src/lib/**/*.ts"], reporter: ["json", "html"] },
  },
})
