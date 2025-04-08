const { configure, presets } = require('eslint-kit')

module.exports = configure({
  root: __dirname,

  extend: {
    rules: {
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': 'off',
      'import/no-cycle': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],

      'unicorn/number-literal-case': 'off',

      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    },
  },

  presets: [
    presets.imports({
      sort: {
        newline: true,
      },
    }),
    presets.typescript({
      enforceUsingType: true,
    }),
    presets.prettier(),
  ],
})
