import { Meta, StoryObj } from '@storybook/react';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import { PublishedInvoice } from './published-invoice';

type Story = StoryObj<typeof PublishedInvoice>;

const meta = {
  title: 'Invoices/V2/PublishedInvoice',
  component: PublishedInvoice,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PublishedInvoice>;

export default meta;

export const Default: Story = {
  args: {
    invoice: sampleInvoices[0],
  },
};
