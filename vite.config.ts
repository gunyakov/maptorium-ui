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
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },
      '/core': {
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },
      '/poi': {
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },
      '/job': {
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },

      // '/tile/arcgisvector': {
      //   target: 'http://localhost:9009',
      //   // target:
      //   //   'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/',
      //   changeOrigin: true
      //   // rewrite: (path) => path.replace('/tile/arcgisvector', '')
      // },
      // '/tile/maptorium': {
      //   target: 'http://localhost:9010/',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace('/tile/maptorium', '')
      // },
      '/tile': {
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },
      '/map': {
        target: 'http://127.0.0.1:9009',
        changeOrigin: true
      },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://127.0.0.1:9009',
        ws: true
      }
    }
  }
})
