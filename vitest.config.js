import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    jsxDev: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
  },
});
