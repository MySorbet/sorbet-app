import { Meta, StoryObj } from '@storybook/react';

import { Splash } from './splash';

const meta = {
  title: 'Splash',
  component: Splash,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Splash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
