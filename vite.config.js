import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/photo-gallery-react/',
  server: {
    host: '0.0.0.0'
  }
})
