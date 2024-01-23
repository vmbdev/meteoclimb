import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    root: 'frontend',
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    test: {
      include: ['src/tests/*.{test,spec}.?(c|m)[jt]s?(x)'],
      watch: true,
      open: true,
      environment: 'happy-dom',
      setupFiles: ['src/tests/setup.js'],
    },
  };
});
