
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages deployment, if your URL is username.github.io/repo/, 
  // set base to '/repo/'. Using './' makes it relative and more portable.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  }
});
