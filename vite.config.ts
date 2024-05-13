import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/gps': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/core': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/poi': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/job': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/tile': {
        target: 'http://localhost:9009',
        changeOrigin: true
      },
      '/map': {
        target: 'http://localhost:9009',
        changeOrigin: true
      }
    }
  }
})
