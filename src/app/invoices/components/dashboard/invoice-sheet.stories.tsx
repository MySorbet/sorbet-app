import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import InvoiceSheet from './invoice-sheet';

const meta = {
  title: 'Invoices/InvoiceSheet',
  component: InvoiceSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    invoice: sampleInvoices[0],
    onCancel: fn(),
    onEdit: fn(),
    onDownload: fn(),
    setOpen: fn(), // overridden via render
    onInvoiceStatusChange: fn(),
  },
} satisfies Meta<typeof InvoiceSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    // This is some SB boiler plate to sync the control with drawer state
    const [{ open }, updateArgs] = useArgs();
    const handleSetOpen = (open: boolean) => {
      updateArgs({ open });
    };
    return <InvoiceSheet {...args} open={open} setOpen={handleSetOpen} />;
  },
};

export const Cancelled: Story = {
  render: Default.render,
  args: {
    invoice: {
      ...sampleInvoices[0],
      status: 'Cancelled',
    },
  },
};
