import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {port: 3000},
  // The example consumes the library from the parent directory via `file:..`,
  // so the built output must be picked up rather than the TypeScript sources.
  optimizeDeps: {exclude: ['react-monnify']},
});
