import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dist-ssr/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
        process: 'readonly',
      },
    },
    rules: {
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-unreachable': 'error',
    },
  },
)
