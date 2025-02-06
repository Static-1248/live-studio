import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "./client",
  plugins: [vue(), tailwindcss()],
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
