/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Makes Vitest APIs globally available (like describe, it, expect)
    environment: 'jsdom', // Use jsdom to simulate browser environment
    setupFiles: './vitest.setup.ts', // Optional: Setup file for global test setup (we'll create this next)
    // Include component tests
    include: ['src/**/*.test.{ts,tsx}'],
    // Exclude API routes and node_modules
    exclude: ['node_modules', 'src/app/api/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Mirror the tsconfig path alias
    },
  },
});
