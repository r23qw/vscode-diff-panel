module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': 'off',
  },
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    extraFileExtensions: ['.vue'],
  },
}
