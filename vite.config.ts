import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'Social-Quote-Slide-Generator' with the actual name of your GitHub repository.
  base: '/Social-Quote-Slide-Generator/', 
})
