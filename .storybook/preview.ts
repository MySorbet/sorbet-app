import type { Preview } from '@storybook/react';
import '@/styles/globals.css';

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
};

export default preview;
