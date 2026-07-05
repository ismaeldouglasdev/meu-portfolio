import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
  build: {
    manualChunks: (id) =>
      id.includes('node_modules') &&
      id !== 'node_modules/react-dom/client' &&
      (id.includes('react') ||
        id.includes('react-dom') ||
        id.includes('@chakra-ui/react') ||
        id.includes('@emotion/react') ||
        id.includes('@emotion/styled') ||
        id.includes('@mui/material')),
  },
})
