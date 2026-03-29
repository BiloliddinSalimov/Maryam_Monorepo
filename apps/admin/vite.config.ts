import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Raise warning threshold — 710 kB is our lazy-split baseline
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks so browsers can cache them
        // independently from app code
        manualChunks: {
          // React core — almost never changes → long cache life
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // TanStack Query — cache layer
          'vendor-query': ['@tanstack/react-query'],
          // Form + validation — heavy, rarely changes
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Radix UI / shadcn components — UI primitives (only installed packages)
          'vendor-ui': [
            '@radix-ui/react-select',
            '@radix-ui/react-dialog',
            '@radix-ui/react-tabs',
          ],
          // Icons — lucide is large
          'vendor-icons': ['lucide-react'],
          // HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
  },
})
