module.exports = {
  extends: '@antfu',
  env: {
    node: true,
    browser: false,
  },
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    extraFileExtensions: ['.vue'],
  },
}
