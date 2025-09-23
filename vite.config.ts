import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    sourcemap: true,
    target: 'es2015',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  define: {
    global: 'globalThis',
    'import.meta.env.VITE_GTM_ID': JSON.stringify(process.env.VITE_GTM_ID || 'G-XF74RC576V'),
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      // Force axios to skip fetch adapter (prevents destructuring error in some prod envs)
      'axios/lib/adapters/fetch.js': '/src/shims/axios-fetch-adapter.js',
      'axios/adapters/fetch': '/src/shims/axios-fetch-adapter.js',
      'axios/dist/browser/axios.cjs': '/src/shims/axios-fetch-adapter.js',
    },
  },
});