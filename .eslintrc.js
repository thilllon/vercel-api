/** import() */
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-extra-semi': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-unexpected-multiline': 'off',
  },
};
