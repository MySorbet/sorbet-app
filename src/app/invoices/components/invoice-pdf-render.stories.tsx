import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoicePDFRender } from './invoice-pdf-render';

const meta: Meta<typeof InvoicePDFRender> = {
  title: 'Invoicing/InvoicePDFRender',
  component: InvoicePDFRender,
  parameters: {
    layout: 'centered',
  },
  args: {
    onCreate: fn(),
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoicePDFRender>;

export const Default: Story = {
  args: {
    data: {
      fromName: 'Dillon Cutaiar',
      fromEmail: 'dillon@sorbet.dev',
      toName: 'My Client-01',
      toEmail: 'client01@gmail.com',
      projectName: 'Rebrand',
      invoiceNumber: 'INV-01',
      items: [
        { name: 'Branding design', quantity: 1, amount: 1000 },
        { name: 'Social media creatives', quantity: 1, amount: 500 },
        { name: 'Landing page design', quantity: 1, amount: 2000 },
      ],
      issueDate: new Date('2024-09-27'),
      dueDate: new Date('2024-10-27'),
      memo: 'Please pay within 30 days',
    },
  },
};
