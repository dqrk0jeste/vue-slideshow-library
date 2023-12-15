import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueSlideshowLibrary",
      fileName: "vue-slideshow-library",
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
