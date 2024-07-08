import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

const sslCert = fs.readFileSync(path.resolve(__dirname, '../certs/certificate.crt'));
const sslKey = fs.readFileSync(path.resolve(__dirname, '../certs/private.key'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),    
     mkcert({
    cert: sslCert,
    key: sslKey
  }),], // HTTPS
  server: {
    https: true, // Enable HTTPS
    port: 3000, // Customize the development server port
    open: true, // Automatically open the browser on server start
    verbose: true, // Enable verbose logging
  },
  logLevel: 'silent', // silent
  build: {
    outDir: 'build', // Specify the output directory
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'], // Separate vendor chunks
        },
      },
    },
  },
  envPrefix: 'VITE_', // Environment variables prefix
  esbuild: {
    jsxInject: `import React from 'react'`, // Automatically import React in JSX files
  },
});
