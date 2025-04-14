import { Meta, StoryObj } from '@storybook/react';

import { HandleAvailable } from './handle-available';

const meta = {
  title: 'Profile/HandleAvailable',
  component: HandleAvailable,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HandleAvailable>;

export default meta;

type Story = StoryObj<typeof HandleAvailable>;

export const Default: Story = {
  args: {
    handle: 'handle',
  },
};
