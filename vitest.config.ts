import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    root: './',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_PASSWORD: 'postgres123',
      TEST_DATABASE_HOST: 'localhost',
      TEST_DATABASE_PORT: '5433',
      TEST_DATABASE_NAME: 'fps_logs_analyzer_test',
      TEST_DATABASE_USER: 'postgres',
      TEST_DATABASE_PASSWORD: 'postgres123',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
      ],
    },
  },
});
