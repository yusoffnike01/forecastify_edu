import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5174,
  },
})
