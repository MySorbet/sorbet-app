import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockBridgeCustomerHandlerKycComplete } from '@/api/bridge/msw-handlers';
import { Button } from '@/components/ui/button';

import { AddRecipientSheet } from './add-recipient-sheet';
import { debugToast } from './story-utils';

const meta = {
  title: 'Transfers/AddRecipientSheet',
  component: AddRecipientSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    onSubmit: fn(debugToast),
  },
  argTypes: {
    setOpen: {
      table: {
        disable: true,
      },
    },
    onSubmit: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof AddRecipientSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <AddRecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
};

export const Verified: Story = {
  render: Default.render,
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete],
    },
  },
};
