import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

const sslCert = fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem'));
const sslKey = fs.readFileSync(path.resolve(__dirname, '../certs/key.pem'));

// Chunk split (see build.rollupOptions.output.manualChunks below).
const VENDOR = ['react', 'react-dom', 'react-router-dom'];
const UTILS = [
  'prop-types',
  '@emotion/react',
  '@emotion/styled',
  '@mui/material',
  '@mui/x-date-pickers',
  '@reduxjs/toolkit',
  'axios',
  'date-fns',
  'i18next',
  'i18next-browser-languagedetector',
  'react-i18next',
  'react-icons',
  'react-redux',
  'react-toastify',
  'react-widgets',
  'styled-components',
];


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
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [
    requestLoggerPlugin(),
    react(),
    mkcert({
      cert: sslCert,
      key: sslKey
    }),], // HTTPS
  server: {
    https: false, // Enable HTTPS
    port: parseInt(env.VITE_PORT || 8100), // Customize the development server port
    verbose: true, // Enable verbose logging
    logLevel: 'info',
  },
  preview: {
    https: false,
    port: parseInt(env.VITE_PORT || 8100),
    host:  env.VITE_SERVER_IP || 'localhost',
  },

  build: {
    outDir: 'build', // Specify the output directory
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Vite 8 bundles with Rolldown, which only accepts the FUNCTION form of
        // manualChunks — the old object form throws "manualChunks is not a
        // function". Same split as before, expressed as a matcher.
        //
        // Only REAL runtime dependencies belong here. The old list also contained
        // dev-only tooling (@eslint/js, @testing-library/jest-dom) and packages the
        // app never imports (moment, web-vitals). Keep this in sync with the
        // `dependencies` in package.json.
        manualChunks(id) {
          const pkg = (name) =>
            id.includes(`node_modules/${name}/`) || id.includes(`node_modules\\${name}\\`);

          if (VENDOR.some(pkg)) return 'vendor';
          if (UTILS.some(pkg)) return 'utils';
          return undefined;
        },
      },
    },
  },
  envPrefix: 'VITE_', // Environment variables prefix
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // absolute imports: @/components, @/styles, ...
    },
  },
  // NOTE: there used to be `esbuild: { jsxInject: "import React from 'react'" }`.
  // Vite 8 transforms with Oxc, not esbuild, so it was silently ignored — and it
  // was never needed: @vitejs/plugin-react uses React's AUTOMATIC JSX runtime, so
  // React does not have to be in scope to write JSX. Verified: no source file
  // references `React.` directly. (This is also why the ESLint rule
  // `react/react-in-jsx-scope` stays off.)
}
});
