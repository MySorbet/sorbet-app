import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockRecipients } from '@/api/recipients/mock';

import { SendToCard } from './send-to-card';

const meta = {
  title: 'Transfers/SendToCard',
  component: SendToCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSend: fn(),
    onAdd: fn(),
  },
} satisfies Meta<typeof SendToCard>;

export default meta;

type Story = StoryObj<typeof SendToCard>;

export const Default: Story = {
  args: {
    maxAmount: 1000,
    recipients: mockRecipients,
  },
};
