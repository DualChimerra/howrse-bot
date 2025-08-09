import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: [
          resolve(__dirname, 'electron/main.ts'),
          resolve(__dirname, 'src/main/index.ts'),
        ]
      }
    },
    resolve: {
      alias: {
        '@common': resolve(__dirname, 'src/common'),
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload.ts')
      }
    }
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, 'dist/renderer')
    },
    server: {
      port: 5173,
      strictPort: true
    },
    resolve: {
      alias: {
        '@common': resolve(__dirname, 'src/common'),
      }
    }
  }
})