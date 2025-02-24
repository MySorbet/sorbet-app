import { Meta, StoryObj } from '@storybook/react';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import { PublicInvoice } from './public-invoice';

const meta = {
  title: 'Invoices/PublicInvoice',
  component: PublicInvoice,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    invoice: sampleInvoices[0],
  },
} satisfies Meta<typeof PublicInvoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
