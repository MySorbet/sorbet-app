import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceControls } from './invoice-controls';
import { InvoiceFormDecorator } from './invoice-form-decorator';

const meta = {
  title: 'Invoices/InvoiceControls',
  component: InvoiceControls,
  parameters: {
    layout: 'centered',
  },
  decorators: [InvoiceFormDecorator],
} satisfies Meta<typeof InvoiceControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    walletAddress: '0x0000000000000000000000000000000000000000',
  },
};

export const Unverified: Story = {
  args: {
    ...Default.args,
    onGetVerified: fn(),
  },
};
