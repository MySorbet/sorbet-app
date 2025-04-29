module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'unused-imports',
    'check-file',
  ],
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

    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*': 'KEBAB_CASE',
      },
      { ignoreMiddleExtensions: true },
    ],
  },
  globals: {
    React: true,
    JSX: true,
  },
  ignorePatterns: [
    'src/components/ui/*', // Don't lint shadcn components (they use different rules than us)
    'src/components/syntax-ui/*', // Same as above
    'src/components/chat/*', // Chat components are not used currently, but may be used in the future (ignore for now)
    'src/hooks/chat/*', // Same as above
  ],
};
