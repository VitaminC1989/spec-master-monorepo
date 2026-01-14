import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // 代理 API 请求到 NestJS 后端
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  }
})

