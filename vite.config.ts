import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/videos': {
        target: 'http://localhost:5173',
        rewrite: (path) => `/src/assets${path}`
      }
    }
  },
  assetsInclude: ['**/*.mp4']
});
