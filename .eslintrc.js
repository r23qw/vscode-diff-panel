module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    extraFileExtensions: ['.vue'],
  },
}
