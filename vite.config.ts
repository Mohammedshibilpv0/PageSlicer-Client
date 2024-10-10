import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['react-pdf'],
//   },
//   build: {
//     commonjsOptions: {
//       include: [/react-pdf/, /pdfjs-dist/],
//     },
//   },
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// });

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-pdf', 'react'],
  },
  build: {
    commonjsOptions: {
      include: [/react-pdf/, /pdfjs-dist/, /node_modules/],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
