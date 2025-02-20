import type { Meta, StoryObj } from '@storybook/react';

import { PaymentTab } from './payment-tab';

type Story = StoryObj<typeof PaymentTab>;

const meta = {
  title: 'Invoices/V2/PaymentTab',
  component: PaymentTab,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PaymentTab>;

export default meta;

export const Default: Story = {};
