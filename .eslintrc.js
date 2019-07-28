module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vuetify/no-deprecated-classes': 'error'
  },
  plugins: [
    'vuetify'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  }
}
