import { Meta, StoryObj } from '@storybook/react';

import { ErrorFallback } from './error-fallback';

const meta = {
  title: 'Component/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotFound: Story = {
  args: {
    type: 'not-found',
  },
};
