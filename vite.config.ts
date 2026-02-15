import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      base: '/venus/',  // GitHub Pages repository name
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'docs',  // GitHub Pages serves from /docs
        rollupOptions: {
          output: {
            manualChunks: {
              recharts: ['recharts'],
            },
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
