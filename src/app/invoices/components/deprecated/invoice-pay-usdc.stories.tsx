import { StoryObj } from '@storybook/react';
import { Meta } from '@storybook/react';

import { InvoicePayUsdc } from './invoice-pay-usdc';

const meta = {
  title: 'Invoices/Deprecated/InvoicePayUsdc',
  component: InvoicePayUsdc,
  parameters: {
    backgrounds: {
      default: 'sorbet',
    },
    layout: 'centered',
  },
} satisfies Meta<typeof InvoicePayUsdc>;

export default meta;

type Story = StoryObj<typeof InvoicePayUsdc>;
export const Default: Story = {
  args: {
    address: '0x1234567890123456789012345678901234567890',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
