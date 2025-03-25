import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { OnboardWithHandles } from './onboard-with-handles';

const meta = {
  title: 'Profile/v2/OnboardWithHandles',
  component: OnboardWithHandles,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof OnboardWithHandles>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
