import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    globals: false,
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    watch: {
        usePolling: true
    }
  },
  base: '/bingo-generator/'
})
