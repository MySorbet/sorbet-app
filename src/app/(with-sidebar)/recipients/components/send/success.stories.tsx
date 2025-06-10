import { Meta, StoryObj } from '@storybook/react';

import { mockRecipients } from '@/api/recipients/mock';

import { Success } from './success';

const meta = {
  title: 'Transfers/Success',
  component: Success,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Success>;

export default meta;

type Story = StoryObj<typeof Success>;

export const Default: Story = {
  args: {
    amount: 100,
    recipient: mockRecipients[0],
  },
};

export const Crypto: Story = {
  args: {
    amount: 100,
    recipient: mockRecipients[1],
  },
};
