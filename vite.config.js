import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: "./client",
  plugins: [vue()],
  server: {
    port: 5173, // 明确指定开发服务器端口
    proxy: {
      "/ws": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "../client/dist",
  },
});
