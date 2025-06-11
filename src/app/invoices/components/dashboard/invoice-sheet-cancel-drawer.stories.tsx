import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceSheetCancelDrawer } from './invoice-sheet-cancel-drawer';

const meta = {
  title: 'Invoices/InvoiceSheetCancelDrawer',
  component: InvoiceSheetCancelDrawer,
  parameters: {},
  args: {
    onCancel: fn(),
    open: true,
  },
} satisfies Meta<typeof InvoiceSheetCancelDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleSetOpen = (open: boolean) => {
      updateArgs({ open });
    };
    return (
      <InvoiceSheetCancelDrawer {...args} open={open} setOpen={handleSetOpen} />
    );
  },
};
