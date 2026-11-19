import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/juans-sanrio-scientific-calculator/',
  plugins: [react()],
})
