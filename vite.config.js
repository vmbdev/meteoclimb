import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    root: 'frontend',
    build: {
      outDir: 'build',
    },
    plugins: [react()],
  };
});
