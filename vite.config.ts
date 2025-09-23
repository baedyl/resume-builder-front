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
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://api.proairesume.online'),
    'import.meta.env.VITE_API_AUDIENCE': JSON.stringify(process.env.VITE_API_AUDIENCE || 'https://api.proairesume.online'),
    'import.meta.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify(process.env.VITE_STRIPE_PUBLIC_KEY || ''),
    'import.meta.env.VITE_GTM_ID': JSON.stringify(process.env.VITE_GTM_ID || 'G-XF74RC576V'),
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
});