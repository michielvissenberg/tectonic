import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Next.js sets tsconfig `jsx` to `preserve`; tests still need the automatic JSX runtime.
  oxc: {
    jsx: { runtime: 'automatic' },
  },
  test: {
    environment: 'jsdom',
  },
});
