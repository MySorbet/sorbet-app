import type { Meta, StoryObj } from '@storybook/react';

import { ControlBar } from './control-bar';

const meta = {
  title: 'Profile/v2/ControlBar',
  component: ControlBar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ControlBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
