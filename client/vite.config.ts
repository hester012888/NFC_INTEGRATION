import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"   // ← 新增

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),                            // ← 新增
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
})