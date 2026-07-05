import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['frank'],
    proxy: {
      '/api/report': {
        target: 'http://127.0.0.1:7823',
        rewrite: path => path.replace(/^\/api\/report/, '/report'),
      },
      // photo-upload Worker (workers/photo-upload) via `wrangler dev`
      '/api/photo-upload': {
        target: 'http://127.0.0.1:8787',
      },
    },
  },
})
