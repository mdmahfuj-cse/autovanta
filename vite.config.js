import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Always a single React instance — prevents the "Cannot read properties
    // of null (reading 'useState')" dual-React error after dev restarts.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: true,
    port: 5173,
    // The preview environment proxies through dynamic *.e2b.app hosts.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
});
