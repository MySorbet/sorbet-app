import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceFormDecorator } from './invoice-form-decorator';
import { PaymentTab } from './payment-tab';

type Story = StoryObj<typeof PaymentTab>;

const meta = {
  title: 'Invoices/PaymentTab',
  component: PaymentTab,
  parameters: {
    layout: 'centered',
  },
  decorators: [InvoiceFormDecorator],
} satisfies Meta<typeof PaymentTab>;

export default meta;

export const Default: Story = {};

export const Unverified: Story = {
  args: {
    onGetVerified: fn(),
  },
};

export const WithWalletAddress: Story = {
  args: {
    walletAddress: '0x0000000000000000000000000000000000000000',
  },
};
