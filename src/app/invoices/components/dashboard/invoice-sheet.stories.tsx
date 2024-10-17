import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import InvoiceSheet from './invoice-sheet';
import { sampleInvoices } from './sample-invoices';

const meta: Meta<typeof InvoiceSheet> = {
  title: 'Invoicing/InvoiceSheet',
  component: InvoiceSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    invoice: sampleInvoices[0],
    onCancel: fn(),
    onEdit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceSheet>;

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
