import type { Preview } from '@storybook/react';
import '@/styles/globals.css';
import { ProvidersDecorator } from './decorators/providers.decorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [{ name: 'sorbet', value: '#f3f3f3' }],
    },
  },
  decorators: [ProvidersDecorator],
};

export default preview;
