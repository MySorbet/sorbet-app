import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { PublicInvoiceHeader } from './public-invoice-header';

const meta = {
  title: 'Invoices/PublicInvoiceHeader',
  component: PublicInvoiceHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    from: 'John Doe',
    onDownload: fn(),
  },
} satisfies Meta<typeof PublicInvoiceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    from: undefined,
  },
};
