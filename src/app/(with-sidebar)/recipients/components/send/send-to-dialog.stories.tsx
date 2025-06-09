import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SendToDialog } from './send-to-dialog';

const meta = {
  title: 'Transfers/SendToDialog',
  component: SendToDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    onAdd: fn(),
  },
} satisfies Meta<typeof SendToDialog>;

export default meta;

type Story = StoryObj<typeof SendToDialog>;

export const Default: Story = {
  args: {
    onAdd: fn(),
  },
};
