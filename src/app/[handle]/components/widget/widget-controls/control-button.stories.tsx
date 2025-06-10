import { Meta, StoryObj } from '@storybook/react';

import { ControlButton } from './control-button';

const meta = {
  title: 'ControlButton',
  component: ControlButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ControlButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
