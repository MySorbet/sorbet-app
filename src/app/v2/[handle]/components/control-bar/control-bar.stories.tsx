import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ControlBar } from './control-bar';

const meta = {
  title: 'Profile/v2/ControlBar',
  component: ControlBar,
  parameters: {
    layout: 'centered',
  },
  args: {
    onAddImage: fn(),
    onAddLink: fn(),
    onShare: fn(),
  },
} satisfies Meta<typeof ControlBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
