import { PDFViewer } from '@react-pdf/renderer';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoicePDF } from './invoice-pdf';

const meta: Meta<typeof InvoicePDF> = {
  title: 'Invoicing/InvoicePDF',
  component: InvoicePDF,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <PDFViewer width={800} height={600} showToolbar={false}>
        <Story />
      </PDFViewer>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InvoicePDF>;

export const SampleInvoice: Story = {
  args: {
    from: {
      name: 'Rami Djebari',
      email: 'rami.djeb@gmail.com',
    },
    to: {
      name: 'My Client-01',
      email: 'client01@gmail.com',
    },
    details: {
      project: 'Rebrand',
      invoiceNumber: 'INV-01',
    },
    items: [
      { description: 'Branding design', quantity: 1, amount: 1000 },
      { description: 'Social media creatives', quantity: 1, amount: 500 },
      { description: 'Landing page design', quantity: 1, amount: 2000 },
    ],
    total: 3500.0,
    terms: {
      issued: '27 Sep 2024',
      due: '27 Oct 2024',
      payment: 'USDC',
    },
  },
};
