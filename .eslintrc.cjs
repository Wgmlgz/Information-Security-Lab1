/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: false,
  },
  env: {
    node: true,
    es2022: true,
  },
  plugins: ['@typescript-eslint', 'security'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:security/recommended'],
  ignorePatterns: ['dist/**', 'node_modules/**'],
  rules: {
    'security/detect-object-injection': 'off',
  },
};

