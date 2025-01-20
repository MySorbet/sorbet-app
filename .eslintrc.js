module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  rules: {
    'no-console': 'off',
    'no-useless-escape': 'warn',

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ],

    '@next/next/no-img-element': 'off',

    // Use no-unused-vars from unused-imports rather than from eslint or @typescript-eslint
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
  },
  globals: {
    React: true,
    JSX: true,
  },

  // We don't want to touch shadcn for now (nor syntax-ui)
  ignorePatterns: ['src/components/ui/*', 'src/components/syntax-ui/*'],
};
