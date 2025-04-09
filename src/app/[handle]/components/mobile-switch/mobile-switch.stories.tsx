import { Meta, StoryObj } from '@storybook/react';

import { MobileSwitch } from './mobile-switch';

const meta = {
  title: 'Mobile Switch',
  component: MobileSwitch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MobileSwitch>;

export default meta;

type Story = StoryObj<typeof MobileSwitch>;

export const Default: Story = {};
