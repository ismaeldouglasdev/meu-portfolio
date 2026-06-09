import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['framer-motion'],
  },
  ssr: {
    noExternal: ['framer-motion'],
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.venv/**',
        '**/__pycache__/**',
        '**/*.pyc',
        '**/site-packages/**',
        '**/pythonProject/**',
        '**/pythonProject2/**',
      ],
    },
  },
})
