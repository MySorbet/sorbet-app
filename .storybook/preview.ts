import type { Preview } from '@storybook/react';
import '@/styles/globals.css';
import { ProvidersDecorator } from './decorators/providers.decorator';
import { initialize, mswLoader } from 'msw-storybook-addon';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  // Stop MSW from logging a bunch of warnings in the console
  onUnhandledRequest: 'bypass',
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      values: [
        { name: 'sorbet', value: '#f3f3f3' },
        { name: 'white', value: '#ffffff' },
      ],
      default: 'white',
    },
  },
  decorators: [ProvidersDecorator],
  loaders: [mswLoader],
};

export default preview;
