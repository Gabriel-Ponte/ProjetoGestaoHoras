import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

const sslCert = fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'));
const sslKey = fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'));


function requestLoggerPlugin() {
  return {
    name: 'request-logger',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    requestLoggerPlugin(),
    react(),
    mkcert({
      cert: sslCert,
      key: sslKey
    }),], // HTTPS
  server: {
    https: false, // Enable HTTPS
    port: 8100, // Customize the development server port
    verbose: true, // Enable verbose logging
    logLevel: 'info',
  },
  preview: {
    https: false,
    port: 3000,
    host: '192.168.10.189',
  },

  build: {
    outDir: 'build', // Specify the output directory
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'], // Separate vendor chunks
          utils: [
            'prop-types',
            '@emotion/react',
            '@emotion/styled',
            '@eslint/js',
            '@mui/material',
            '@mui/x-date-pickers',
            '@reduxjs/toolkit',
            '@testing-library/jest-dom',
            'axios',
            'date-fns',
            'moment',
            'react-icons',
            'react-redux',
            'react-toastify',
            'react-widgets',
            'styled-components',
            'web-vitals',
          ],
        },
      },
    },
  },
  envPrefix: 'VITE_', // Environment variables prefix
  esbuild: {
    jsxInject: `import React from 'react'`, // Automatically import React in JSX files
  },
});
