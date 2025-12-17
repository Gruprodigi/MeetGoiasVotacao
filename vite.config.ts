import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante caminhos relativos corretos no build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})