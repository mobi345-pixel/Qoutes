import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // FIX: This path MUST match your repository name on GitHub exactly.
  base: '/Qoutes/',
  define: {
    // This makes the API key available to the app during the build process
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
})