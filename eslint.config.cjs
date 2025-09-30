// ESLint v9 flat config
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const security = require('eslint-plugin-security');

module.exports = [
  { ignores: ['dist/**', 'node_modules/**'] },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      security,
    },
    rules: {
      // Start from TS recommended
      ...tsPlugin.configs.recommended.rules,

      // Security plugin
      'security/detect-object-injection': 'off',

      // Project preferences
      'no-undef': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];


