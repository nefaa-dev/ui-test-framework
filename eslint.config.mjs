import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['node_modules', 'playwright-report', 'test-results', '.auth'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { ...playwright.configs['flat/recommended'], files: ['tests/**/*.ts'] },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['test', 'expect'],
              message:
                'Import { test, expect } from "@fixtures" so fixtures and matchers are available.',
            },
          ],
        },
      ],
      'playwright/no-wait-for-timeout': 'error',
    },
  },
  prettier,
);
