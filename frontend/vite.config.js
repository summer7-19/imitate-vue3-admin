import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8090',
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toLocaleString('zh-CN', { hour12: false })),
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8091,
    host: '127.0.0.1',
    proxy: apiProxy,
  },
  preview: {
    port: 8091,
    host: '127.0.0.1',
    proxy: apiProxy,
  },
})
