import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
//import mkcert from 'vite-plugin-mkcert'


// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react(), mkcert()],    // HTTPS
  plugins: [react()], //HTTP
  server: {
    // https: true, // Enable HTTPS
    port: 3000, // Customize the development server port
    open: true, // Automatically open the browser on server start
    verbose: true, // Enable verbose logging
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
  },
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
