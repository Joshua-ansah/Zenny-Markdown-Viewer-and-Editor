import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry point
        entry: 'src/main/index.ts',
        vite: {
          build: {
            outDir: 'dist/main',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        // Preload scripts
        entry: 'src/preload/index.ts',
        onstart(options) {
          // Notify the renderer process to reload the page when the preload scripts build is complete
          options.reload();
        },
        vite: {
          build: {
            outDir: 'dist/preload',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
    ]),
    electronRenderer(),
  ],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false, // Disable for production, enable for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'codemirror-vendor': [
            '@codemirror/state',
            '@codemirror/view',
            '@codemirror/lang-markdown',
            '@codemirror/commands',
            '@codemirror/language',
          ],
          'markdown-vendor': ['marked', 'dompurify', 'highlight.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit for Electron apps
    target: 'esnext', // Electron uses modern Chromium
  },
  server: {
    port: 5173,
  },
});
