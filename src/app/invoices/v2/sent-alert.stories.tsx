import type { Meta, StoryObj } from '@storybook/react';

import { SentAlert } from './sent-alert';

const meta = {
  title: 'Invoices/SentAlert',
  component: SentAlert,
  parameters: {
    layout: 'centered',
  },
  args: {
    recipientEmail: 'client@example.com',
  },
  argTypes: {
    recipientEmail: {
      control: 'text',
      description: 'Email address of the invoice recipient',
    },
  },
} satisfies Meta<typeof SentAlert>;

export default meta;
type Story = StoryObj<typeof SentAlert>;

export const Default: Story = {};

export const LongEmail: Story = {
  args: {
    recipientEmail: 'very.long.email.address@some-company-domain.com',
  },
};

export const ShortEmail: Story = {
  args: {
    recipientEmail: 'me@x.com',
  },
};
