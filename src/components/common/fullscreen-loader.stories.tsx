import type { Meta, StoryObj } from '@storybook/react';

import { FullscreenLoader } from './fullscreen-loader';

const meta = {
  title: 'Common/FullscreenLoader',
  component: FullscreenLoader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    label: 'Switching network…',
  },
} satisfies Meta<typeof FullscreenLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

