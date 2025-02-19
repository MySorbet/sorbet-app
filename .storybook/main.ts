import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@alexgorbatchev/storybook-addon-localstorage',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  staticDirs: ['../public'],

  core: {
    disableTelemetry: true,
  },

  // So that SVG imports work
  // https://github.com/storybookjs/storybook/issues/18557#issuecomment-2366828752
  webpackFinal: async (config) => {
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      if (rule instanceof Object && 'test' in rule) {
        return rule.test?.toString().includes('svg');
      }
    }) as Record<string, any>;

    config.module?.rules?.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [/url/] }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
export default config;
