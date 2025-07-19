import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      
    }
  },
  build: {
    // raise limit so 500 KB warning is silenced
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // split out React-related code
            if (id.includes("react")) {
              return "vendor_react";
            }
            // split out charting library
            if (id.includes("recharts")) {
              return "vendor_recharts";
            }
            // all other third-party code
            return "vendor";
          }
        }
      }
    }
  }
})
