import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceSheetCancelDrawer } from './invoice-sheet-cancel-drawer';

export default {
  title: 'Invoicing/InvoiceSheetCancelDrawer',
  component: InvoiceSheetCancelDrawer,
  parameters: {},
  args: {
    onCancel: fn(),
    open: true,
  },
} satisfies Meta<typeof InvoiceSheetCancelDrawer>;

type Story = StoryObj<typeof InvoiceSheetCancelDrawer>;

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
