import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceFormDecorator } from './invoice-form-decorator';
import { PaymentTab } from './payment-tab';

const meta = {
  title: 'Invoices/PaymentTab',
  component: PaymentTab,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    InvoiceFormDecorator,
    (Story) => <div className='w-[400px]'>{Story()}</div>,
  ],
} satisfies Meta<typeof PaymentTab>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const WithEurEndorsed: Story = {
  args: {
    isEurEndorsed: true,
  },
};
